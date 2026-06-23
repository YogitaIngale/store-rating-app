import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
  const existing = await this.userRepo.findOne({ where: { email: dto.email } });
  if (existing) throw new BadRequestException('Email address registered with an active profile.');
  
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const user = this.userRepo.create({ ...dto, password: hashedPassword });
  const savedUser = await this.userRepo.save(user);
  
  
  const { password, ...result } = savedUser;
  return result;
}

  async login(credentials: any) {
    const user = await this.userRepo.findOne({ where: { email: credentials.email } });
    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new UnauthorizedException('Access Denied. Review system configuration parameters.');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}