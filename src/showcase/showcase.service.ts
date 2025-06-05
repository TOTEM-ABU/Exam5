import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateShowcaseDto) {
    const existingShowcase = await this.prisma.showcase.findFirst({
      where: { name: data.name },
    });

    if (existingShowcase) {
      throw new BadRequestException('Bu nomli showcase allaqachon mavjud');
    }

    try {
      return await this.prisma.showcase.create({ data });
    } catch (error) {
      throw new BadRequestException('Showcase yaratishda xatolik!');
    }
  }

  async findAll(query: {
    name?: string;
    description?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'name' | 'createdAt';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name = '',
        description = '',
        sort = 'asc',
        sortBy = 'name',
        page = 1,
        limit = 10,
      } = query;

      const where: Prisma.ShowcaseWhereInput = {
        name: {
          contains: name,
          mode: Prisma.QueryMode.insensitive,
        },
        description: {
          contains: description,
          mode: Prisma.QueryMode.insensitive,
        },
      };

      const showcases = await this.prisma.showcase.findMany({
        where,
        orderBy: { [sortBy]: sort },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.showcase.count({ where });

      return {
        data: showcases,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Showcase larni olishda xatolik!');
    }
  }

  async findOne(id: string) {
    const existingShowcase = await this.prisma.showcase.findUnique({
      where: { id },
    });

    if (!existingShowcase) {
      throw new BadRequestException('Bunday showcase topilmadi');
    }

    try {
      const showcase = await this.prisma.showcase.findUnique({ where: { id } });
      return showcase;
    } catch (error) {
      throw new HttpException(
        'Showcaseni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateShowcaseDto) {
    const existingShowcase = await this.prisma.showcase.findUnique({
      where: { id },
    });

    if (!existingShowcase) {
      throw new BadRequestException('Bunday showcase topilmadi');
    }

    try {
      return await this.prisma.showcase.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException('Showcase yangilashda xatolik!');
    }
  }

  async remove(id: string) {
    const existingShowcase = await this.prisma.showcase.findUnique({
      where: { id },
    });

    if (!existingShowcase) {
      throw new BadRequestException('Bunday showcase topilmadi');
    }

    try {
      return await this.prisma.showcase.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Showcase o‘chirishda xatolik!');
    }
  }
}
