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

  async create(data: CreateCapacityDto) {
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
      const capacity = await this.prisma.capacity.create({ data });

      return capacity;
    } catch (error) {
      throw new HttpException(
        'Sig‘im yaratishda xatolik yuz berdi',
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
      throw new BadRequestException('Sig‘imlar hali mavjud emas!');
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
      });

      return capacity;
    } catch (error) {
      throw new NotFoundException('Sig‘imni olishda xatolik');
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
      throw new HttpException(
        'Sig‘imni yangilashda xatolik',
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(
        'Sig‘imni o‘chirishda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
