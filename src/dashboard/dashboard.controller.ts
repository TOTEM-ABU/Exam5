import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Request } from 'express';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { RoleType } from '@prisma/client';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getBrands(@Req() req: Request) {
    return this.dashboardService.myBrands(req['user']);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getSizes(@Req() req: Request) {
    return this.dashboardService.mySizes(req['user']);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getCapacities(@Req() req: Request) {
    return this.dashboardService.myCapacities(req['user']);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getTools(@Req() req: Request) {
    return this.dashboardService.myTools(req['user']);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getProducts(@Req() req: Request) {
    return this.dashboardService.myProducts(req['user']);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getMasters(@Req() req: Request) {
    return this.dashboardService.myMasters(req['user']);
  }

  @Roles(
    RoleType.ADMIN,
    RoleType.SUPER_ADMIN,
    RoleType.USER,
    RoleType.VIEWER_ADMIN,
  )
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getComments(@Req() req: Request) {
    return this.dashboardService.myComments(req['user']);
  }

  @Roles(
    RoleType.ADMIN,
    RoleType.SUPER_ADMIN,
    RoleType.USER,
    RoleType.VIEWER_ADMIN,
  )
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getOrders(@Req() req: Request) {
    return this.dashboardService.myOrders(req['user']);
  }

  @Roles(
    RoleType.ADMIN,
    RoleType.SUPER_ADMIN,
    RoleType.USER,
    RoleType.VIEWER_ADMIN,
  )
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  getStars(@Req() req: Request) {
    return this.dashboardService.myStars(req['user']);
  }

  @Roles(
    RoleType.ADMIN,
    RoleType.SUPER_ADMIN,
    RoleType.USER,
    RoleType.VIEWER_ADMIN,
  )
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  me(@Req() req: Request) {
    return this.dashboardService.myProfile(req['user']);
  }
}
