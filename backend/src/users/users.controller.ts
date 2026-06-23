import { Controller, Post, Get, Body, UseGuards, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin-create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  createByAdmin(@Body() dto: CreateUserDto) {
    return this.usersService.createAdminOrUser(dto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Req() req: any, @Body() body: any) {
    return this.usersService.updatePassword(req.user.id, body.currentPassword, body.newPassword);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  getUsers(@Query('role') role?: string) {
    return this.usersService.findAllUsers(role);
  }
}