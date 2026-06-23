import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createAdminOrUser(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email address already registered.');
    
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    const savedUser = await this.userRepo.save(user);
    
    const { password, ...result } = savedUser;
    return result;
  }

  async updatePassword(userId: number, currentPass: string, newPass: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User profile not found.');

    const match = await bcrypt.compare(currentPass, user.password);
    if (!match) throw new BadRequestException('Current credential configuration parameters are invalid.');

    user.password = await bcrypt.hash(newPass, 10);
    await this.userRepo.save(user);
    return { message: 'Password configuration updated successfully.' };
  }

  async findAllUsers(role?: string) {
    const query = this.userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.ownedStore', 'store');

    if (role) {
      query.where('user.role = :role', { role });
    }

    const users = await query.getMany();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }
}