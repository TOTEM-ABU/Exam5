import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { MarkStarDto } from './dto/master-start.dto';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Request } from 'express';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMasterDto: CreateMasterDto, @Req() req: Request) {
    return this.masterService.create(createMasterDto, req['user']);
  }

  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN, RoleType.VIEWER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'passportImage', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'experience', required: false, type: Number })
  @ApiQuery({ name: 'levelId', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'experience', 'createdAt'],
    example: 'createdAt',
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('passportImage') passportImage?: string,
    @Query('year') year?: string,
    @Query('experience') experience?: number,
    @Query('levelId') levelId?: string,
    @Query('productId') productId?: string,
    @Query('sortBy')
    sortBy: 'name' | 'experience' | 'createdAt' = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.masterService.findAll({
      name,
      phone,
      passportImage,
      year,
      experience,
      levelId,
      productId,
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN, RoleType.VIEWER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('star')
  async markStar(@Body() dto: MarkStarDto, @Req() req: any) {
    return this.masterService.markStarForMaster(dto, req['user']);
  }

  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    return this.masterService.update(id, updateMasterDto);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterService.remove(id);
  }
}
