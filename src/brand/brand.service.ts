import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBrandDto) {
    const existingBrand = await this.prisma.brand.findFirst({
      where: {
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
      },
    });

    if (existingBrand) {
      throw new BadRequestException('Bu brend allaqachon mavjud');
    }

    try {
      const brand = await this.prisma.brand.create({ data });

      return brand;
    } catch (error) {
      throw new BadRequestException('Brendni yaratishda xatolik');
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

      const brands = await this.prisma.brand.findMany({
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
        orderBy: {
          [sortBy]: sort,
        },
        skip,
        take,
      });

      const total = await this.prisma.brand.count({
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
        data: brands,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      throw new BadRequestException('Brendlar hali mavjud emas!');
    }
  }

  async findOne(id: string) {
    const exists = await this.prisma.brand.findFirst({ where: { id } });

    if (!exists) {
      throw new HttpException('Brand topilmadi', HttpStatus.NOT_FOUND);
    }
    try {
      const brand = await this.prisma.brand.findUnique({
        where: { id },
      });

      return brand;
    } catch (error) {
      throw new HttpException(
        'Brendni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateBrandDto) {
    const exists = await this.prisma.brand.findFirst({ where: { id } });

    if (!exists) {
      throw new HttpException('Brand topilmadi', HttpStatus.NOT_FOUND);
    }

    try {
      const updated = await this.prisma.brand.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      throw new HttpException(
        'Brendni yangilashda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const exists = await this.prisma.brand.findFirst({ where: { id } });

    if (!exists) {
      throw new HttpException('Brand topilmadi', HttpStatus.NOT_FOUND);
    }

    try {
      const deleted = await this.prisma.brand.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      throw new HttpException(
        'Brendni o‘chirishda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
