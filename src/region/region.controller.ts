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
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { RoleType } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { SessionGuard } from 'src/tools/guards/session/session.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  // @UseGuards(SessionGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateRegionDto) {
    return this.regionService.create(data);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name_uz', 'name_ru', 'name_en'],
    example: 'name_uz',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'name_uz' | 'name_ru' | 'name_en',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.regionService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  // @UseGuards(SessionGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateRegionDto) {
    return this.regionService.update(id, data);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  // @UseGuards(SessionGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
