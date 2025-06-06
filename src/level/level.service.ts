import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { LevelType } from '@prisma/client';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLevelDto) {
    const existingLevel = await this.prisma.level.findFirst({
      where: { name: data.name as LevelType },
    });

    if (existingLevel) {
      throw new InternalServerErrorException('Level already exists!');
    }

    try {
      const level = await this.prisma.level.create({
        data: {
          ...data,
          name: data.name as LevelType,
        },
      });
      return level;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in create level!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: {
    name?: string;
    sortBy?: 'name' | 'minWorkingHours' | 'priceHourly' | 'priceDaily';
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name,
        sortBy = 'name',
        sort = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }

      const levels = await this.prisma.level.findMany({
        where,
        orderBy: {
          [sortBy]: sort,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.level.count({ where });

      return {
        data: levels,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in get all levels!', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: string) {
    try {
      const level = await this.prisma.level.findUnique({
        where: { id },
      });

      if (!level) {
        throw new InternalServerErrorException('Level not found!');
      }

      return level;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in get one level!', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, data: UpdateLevelDto) {
    try {
      const level = await this.prisma.level.update({
        where: { id },
        data: {
          ...data,
          name: data.name as LevelType | undefined,
        },
      });

      if (!level) {
        throw new InternalServerErrorException('Level not found!');
      }

      return level;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in update level!', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    try {
      const level = await this.prisma.level.delete({
        where: { id },
      });

      if (!level) {
        throw new InternalServerErrorException('Level not found!');
      }

      return level;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in delete level!', HttpStatus.NOT_FOUND);
    }
  }
}
