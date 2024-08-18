import { CreateProductUseCase } from '@/application/usecase/create';
import { ListProductsUseCase } from '@/application/usecase/list';
import { ShowProductUseCase } from '@/application/usecase/show';
import { CreateProductRepository } from '@/data/repository/create';
import { ListProductRepository } from '@/data/repository/list';
import { ShowProductRepository } from '@/data/repository/show';
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
      provide: 'ShowRepository',
      useFactory: client => new ShowProductRepository(client),
      inject: ['db'],
    },
    {
      provide: 'ListRepository',
      useFactory: client => new ListProductRepository(client),
      inject: ['db'],
    },
    {
      provide: 'CreateRepository',
      useFactory: client => new CreateProductRepository(client),
      inject: ['db'],
    },
    {
      provide: 'ShowProductUseCase',
      useFactory: repository => new ShowProductUseCase(repository),
      inject: ['ShowRepository'],
    },
    {
      provide: 'ListProductUseCase',
      useFactory: repository => new ListProductsUseCase(repository),
      inject: ['ListRepository'],
    },
    {
      provide: 'CreateProductUseCase',
      useFactory: repository => new CreateProductUseCase(repository),
      inject: ['CreateRepository'],
    },
  ],
})
export class ProductModule {}
