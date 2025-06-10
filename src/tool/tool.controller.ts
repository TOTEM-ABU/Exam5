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
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { RoleType } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { Request } from 'express';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createToolDto: CreateToolDto, @Req() req: Request) {
    return this.toolService.create(createToolDto, req['user']);
  }

  @Get()
  @ApiQuery({ name: 'name_uz', required: false })
  @ApiQuery({ name: 'name_ru', required: false })
  @ApiQuery({ name: 'name_en', required: false })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({ name: 'price', required: false, type: Number })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'sizeId', required: false })
  @ApiQuery({ name: 'capacityId', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name_uz', 'name_ru', 'name_en', 'price', 'createdAt', 'quantity'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('name_uz') name_uz?: string,
    @Query('name_ru') name_ru?: string,
    @Query('name_en') name_en?: string,
    @Query('description') description?: string,
    @Query('price') price?: number,
    @Query('brandId') brandId?: string,
    @Query('sizeId') sizeId?: string,
    @Query('capacityId') capacityId?: string,
    @Query('sortBy')
    sortBy:
      | 'name_uz'
      | 'name_ru'
      | 'name_en'
      | 'price'
      | 'createdAt'
      | 'quantity' = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.toolService.findAll({
      name: name_uz || name_ru || name_en,
      price: price ? Number(price) : undefined,
      brandId,
      sizeId,
      capacityId,
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
    return this.toolService.findOne(id);
  }

  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(id, updateToolDto);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(id);
  }
}
