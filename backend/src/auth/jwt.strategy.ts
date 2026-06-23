import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super({
      // Look for the "Bearer <token>" string inside the incoming request headers
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_2026', // Must match the secret key in auth.module.ts
    });
  }

  // Once the token signature is verified, this automatically runs to Put the user info into NestJS
  async validate(payload: any) {
    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException('Authentication signature invalid or profile expired.');
    }
    return user; 
  }
}