import { CreateProductUseCase } from '@/application/usecase/create';
import { CreateProductRepository } from '@/data/repository/create';
import { DbPrismaClient } from '@/infra/db_client/prisma';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'prisma',
      useClass: PrismaService,
    },
    {
      provide: 'db',
      useClass: DbPrismaClient,
    },
    {
      provide: 'CreateRepository',
      useFactory: client => new CreateProductRepository(client),
      inject: ['db'],
    },
    {
      provide: 'CreateProductUseCase',
      useFactory: repository => new CreateProductUseCase(repository),
      inject: ['CreateRepository'],
    },
  ],
})
export class ProductModule {}
