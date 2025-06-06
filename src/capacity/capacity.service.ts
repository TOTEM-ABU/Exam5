import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCapacityDto, userId: string) {
    const existingCapacity = await this.prisma.capacity.findFirst({
      where: {
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
      },
    });

    if (existingCapacity) {
      throw new HttpException(
        'Bu sig‘im allaqachon mavjud',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const capacity = await this.prisma.capacity.create({
        data: {
          ...data,
          createdBy: userId,
        },
      });

      return capacity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error in create capacity!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'name_uz' | 'name_ru' | 'name_en';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search = '',
        sort = 'asc',
        sortBy = 'name',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const capacities = await this.prisma.capacity.findMany({
        where: {
          name_uz: {
            contains: search,
            mode: 'insensitive',
          },
          name_ru: {
            contains: search,
            mode: 'insensitive',
          },
          name_en: {
            contains: search,
            mode: 'insensitive',
          },
        },
        include: {
          createdByUser: {
            select: {
              firstName: true,
              role: true,
            },
          },
        },
        orderBy: sortBy === 'name' ? { name_uz: sort } : undefined,
        skip,
        take,
      });

      const total = await this.prisma.capacity.count({
        where: {
          name_uz: {
            contains: search,
            mode: 'insensitive',
          },
          name_ru: {
            contains: search,
            mode: 'insensitive',
          },
          name_en: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });

      return {
        data: capacities,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error in get all capacities!',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOne(id: string) {
    const exists = await this.prisma.capacity.findFirst({ where: { id } });

    if (!exists) {
      throw new HttpException('Sig‘im topilmadi', HttpStatus.NOT_FOUND);
    }

    try {
      const capacity = await this.prisma.capacity.findUnique({
        where: { id },
        include: {
          createdByUser: {
            select: {
              firstName: true,
              role: true,
            },
          },
        },
      });

      return capacity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error in get one capacity!',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, data: UpdateCapacityDto) {
    const exists = await this.prisma.capacity.findFirst({ where: { id } });

    if (!exists) {
      throw new HttpException('Sig‘im topilmadi', HttpStatus.NOT_FOUND);
    }

    try {
      const updated = await this.prisma.capacity.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error in update capacity!',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async remove(id: string) {
    const exists = await this.prisma.capacity.findFirst({ where: { id } });

    if (!exists) {
      throw new HttpException('Sig‘im topilmadi', HttpStatus.NOT_FOUND);
    }

    try {
      const deleted = await this.prisma.capacity.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error in delete capacity!',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
