import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateToolDto, userId: string) {
    const existingTool = await this.prisma.tool.findFirst({
      where: {
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
      },
    });

    if (existingTool) {
      throw new BadRequestException('Bu nomli asbob allaqachon mavjud!');
    }

    try {
      const toolCount = await this.prisma.tool.count();
      const generatedCode = `TL-${(toolCount + 1).toString().padStart(5, '0')}`;

      // brands, sizes, capacities ni ajratamiz
      const { brands, sizes, capacities, ...toolData } = data;

      const tool = await this.prisma.tool.create({
        data: {
          ...toolData,
          code: generatedCode,
          createdBy: userId,
        },
      });

      if (brands?.length) {
        await this.prisma.toolBrand.createMany({
          data: brands.map((brand) => ({
            toolId: tool.id,
            brandId: brand.brandId,
          })),
          skipDuplicates: true,
        });
      }

      if (sizes?.length) {
        await this.prisma.toolSize.createMany({
          data: sizes.map((size) => ({
            toolId: tool.id,
            sizeId: size.sizeId,
          })),
          skipDuplicates: true,
        });
      }

      if (capacities?.length) {
        await this.prisma.toolCapacity.createMany({
          data: capacities.map((capacity) => ({
            toolId: tool.id,
            capacityId: capacity.capacityId,
          })),
          skipDuplicates: true,
        });
      }

      return tool;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in create tool!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: {
    name?: string;
    price?: number;
    brandId?: string;
    sizeId?: string;
    capacityId?: string;
    sortBy?:
      | 'name_uz'
      | 'name_ru'
      | 'name_en'
      | 'price'
      | 'createdAt'
      | 'quantity';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name,
        price,
        brandId,
        sizeId,
        capacityId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (name) {
        where.OR = [
          { name_uz: { contains: name, mode: 'insensitive' } },
          { name_ru: { contains: name, mode: 'insensitive' } },
          { name_en: { contains: name, mode: 'insensitive' } },
        ];
      }

      if (typeof price === 'number') {
        where.price = price;
      }

      if (brandId) {
        where.toolBrands = {
          some: {
            brandId: brandId,
          },
        };
      }

      if (sizeId) {
        where.toolSizes = {
          some: {
            sizeId: sizeId,
          },
        };
      }

      if (capacityId) {
        where.toolCapacities = {
          some: {
            capacityId: capacityId,
          },
        };
      }

      const tools = await this.prisma.tool.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          toolBrands: {
            include: {
              brand: true,
            },
          },
          toolSizes: {
            include: {
              size: true,
            },
          },
          toolCapacities: {
            include: {
              capacity: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.tool.count({ where });

      return {
        data: tools,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error in get all tools!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    const existingTool = await this.prisma.tool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      throw new NotFoundException('Bunday asbob topilmadi!');
    }

    try {
      const tool = await this.prisma.tool.findUnique({
        where: { id },
        include: {
          toolBrands: true,
          toolSizes: true,
          toolCapacities: true,
        },
      });
      if (!tool) {
        throw new BadRequestException('Asbob topilmadi');
      }
      return tool;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in get one tool!', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, data: UpdateToolDto) {
    const existingTool = await this.prisma.tool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      throw new BadRequestException('Bunday asbob topilmadi');
    }

    try {
      return await this.prisma.tool.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in update tool!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingTool = await this.prisma.tool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      throw new BadRequestException('Bunday asbob topilmadi');
    }

    try {
      await this.prisma.tool.delete({
        where: { id },
      });

      return { message: 'Asbob muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error in delete tool!', HttpStatus.BAD_REQUEST);
    }
  }
}
