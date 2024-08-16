import { CreateProductUseCase } from '@/application/usecase/create';
import { CreateProductRepository } from '@/data/repository/create';
import { DbPrismaClient } from '@/infra/db_client/prisma';
import { ParamNotFound } from '@/shared/errors';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let sut: ProductController;
  let service: ProductService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
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
    }).compile();

    sut = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });
  it('should call the service with correct parameter', async () => {
    const params = {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      quantity: faker.number.int({ min: 0, max: 100 }),
    };
    const createSpy = jest.spyOn(service, 'create');
    await sut.create(params);
    expect(createSpy).toHaveBeenCalledWith(params);
  });
  it('should throw Parameter not found error if it is not passed', async () => {
    const promise = sut.create({} as any);
    await expect(promise).rejects.toThrow(new ParamNotFound());
  });
  it('should throw error received from service', async () => {
    jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('Error'));

    const promise = sut.create({} as any);
    await expect(promise).rejects.toThrow();
  });
});
