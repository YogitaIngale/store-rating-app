import { Controller, Post, Get, Body, UseGuards, Query, Req, Put } from '@nestjs/common';
import { StoresService } from './stores.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  create(@Body() body: any) {
    return this.storesService.createStore(body);
  }

  @Get('admin-metrics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  getMetrics() {
    return this.storesService.getAdminDashboardMetrics();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAll(
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.storesService.findAllStores(name, address, sortField, sortOrder);
  }

  @Post('rate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('User')
  rate(@Req() req: any, @Body() body: { storeId: number; score: number }) {
    return this.storesService.submitOrUpdateRating(req.user.id, body.storeId, body.score);
  }

  @Get('owner-metrics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Owner')
  getOwnerMetrics(@Req() req: any) {
    return this.storesService.getOwnerDashboard(req.user.id);
  }
}