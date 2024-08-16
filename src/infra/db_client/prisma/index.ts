import { ICreateProductClient } from '@/data/source/create_product_client.interface..source';
import { PrismaService } from '@/presentation/prisma/prisma.service';
import { CreateDto } from '@/shared/dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DbPrismaClient implements ICreateProductClient {
  constructor(@Inject('prisma') private readonly prisma: PrismaService) {}
  async save(dto: CreateDto): Promise<void> {
    await this.prisma.product.create({ data: dto });
  }
}
