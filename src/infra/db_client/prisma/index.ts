import { ICreateProductClient } from '@/data/source/create_product_client.interface..source';
import { PrismaService } from '@/presentation/prisma/prisma.service';
import { CreateDto, PaginationDto, ResponseDto, UpdateDto } from '@/shared/dto';
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
      this.prisma.product.count(),
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
  async get(name: string): Promise<ResponseDto> {
    const response = await this.prisma.product.findUnique({ where: { name } });
    if (!response) return {} as ResponseDto;
    return {
      item: [
        {
          name: response.name,
          price: response.price,
          quantity: response.quantity,
        },
      ],
    };
  }

  async update(dto: UpdateDto): Promise<void> {
    await this.prisma.product.update({
      where: { name: dto.name },
      data: { [dto.proprity]: dto.value },
    });
  }

  async delete(name: string): Promise<void> {
    await this.prisma.product.delete({ where: { name } });
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
