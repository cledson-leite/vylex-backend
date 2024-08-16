import { ICreateProductClient } from '@/data/source/create_product_client.interface..source';
import { PrismaService } from '@/presentation/prisma/prisma.service';
import { CreateDto, PaginationDto, ResponseDto } from '@/shared/dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DbPrismaClient implements ICreateProductClient {
  constructor(@Inject('prisma') private readonly prisma: PrismaService) {}
  async save(dto: CreateDto): Promise<void> {
    await this.prisma.product.create({ data: dto });
  }

  async getAll(dto?: PaginationDto): Promise<ResponseDto> {
    if (!dto || !dto.page || !dto.limit) {
      const response = await this.prisma.product.findMany();
      return this.fromResponse(response) as ResponseDto;
    }
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const take = limit;
    const [items, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
      }),
      this.prisma.product.count({
        skip,
        take,
      }),
    ]);
    const { item } = this.fromResponse(items);
    return {
      item,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
  private fromResponse(response: any) {
    if (!response || !response.length) return {};
    return {
      item: response.map(product => ({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      })),
    };
  }
}
