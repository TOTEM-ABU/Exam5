import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class GeneralInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGeneralInfoDto) {
    const existingInfo = await this.prisma.generalInfo.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!existingInfo) {
      throw new BadRequestException('Bu email allaqachon mavjud');
    }
    try {
      const info = await this.prisma.generalInfo.create({ data });

      return info;
    } catch (error) {
      throw new BadRequestException('GeneralInfo yaratishda xatolik!');
    }
  }

  async findAll(query: {
    email?: string;
    phones?: string;
    links?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        email = '',
        phones = '',
        links = '',
        sort = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {
        email: { contains: email, mode: 'insensitive' },
        phones: { contains: phones, mode: 'insensitive' },
        links: { contains: links, mode: 'insensitive' },
      };

      const items = await this.prisma.generalInfo.findMany({
        where,
        orderBy: { createdAt: sort },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.generalInfo.count({ where });

      return {
        data: items,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('GeneralInfo olishda xatolik!');
    }
  }

  async findOne(id: string) {
    const info = await this.prisma.generalInfo.findUnique({
      where: { id },
    });

    if (!info) {
      throw new BadRequestException('Bunday GeneralInfo topilmadi!');
    }

    try {
      const info = await this.prisma.generalInfo.findUnique({
        where: { id },
      });
      return info;
    } catch (error) {
      throw new HttpException(
        'Topishda xatolik yuz berdi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateGeneralInfoDto) {
    const existingInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });

    if (!existingInfo) {
      throw new BadRequestException('Bunday GeneralInfo topilmadi!');
    }

    try {
      const updatedInfo = await this.prisma.generalInfo.update({
        where: { id },
        data,
      });

      return updatedInfo;
    } catch (error) {
      throw new BadRequestException('Yangilashda xatolik yuz berdi!');
    }
  }

  async remove(id: string) {
    const existingInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });

    if (!existingInfo) {
      throw new BadRequestException('Bunday GeneralInfo topilmadi!');
    }

    try {
      const deletedInfo = await this.prisma.generalInfo.delete({
        where: { id },
      });

      return deletedInfo;
    } catch (error) {
      throw new BadRequestException('O‘chirishda xatolik yuz berdi!');
    }
  }
}
