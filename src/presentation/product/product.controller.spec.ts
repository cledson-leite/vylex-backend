import { CreateProductUseCase } from '@/application/usecase/create';
import { ListProductsUseCase } from '@/application/usecase/list';
import { ShowProductUseCase } from '@/application/usecase/show';
import { CreateProductRepository } from '@/data/repository/create';
import { ListProductRepository } from '@/data/repository/list';
import { ShowProductRepository } from '@/data/repository/show';
import { DbPrismaClient } from '@/infra/db_client/prisma';
import { PaginationDto } from '@/shared/dto';
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
    }).compile();

    sut = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    it('should call the create method of the service with correct parameter', async () => {
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
  describe('List', () => {
    const params: PaginationDto = {
      page: faker.number.int({ min: 0, max: 100 }),
      limit: faker.number.int({ min: 0, max: 100 }),
    };
    const item = Array(params.limit)
      .fill(null)
      .map(() => ({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        quantity: faker.number.int({ min: 0, max: 100 }),
      }));
    it('should call the list method of the service with correct parameter', async () => {
      const listSpy = jest.spyOn(service, 'list');
      await sut.list(params);
      expect(listSpy).toHaveBeenCalledWith(params);
    });
    it('should call the service without parameter', async () => {
      const listSpy = jest.spyOn(service, 'list');
      await sut.list();
      expect(listSpy).toHaveBeenCalledWith();
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'list').mockRejectedValueOnce(new Error('Error'));

      const promise = sut.list({} as any);
      await expect(promise).rejects.toThrow();
    });

    it('should return a complete list of products if it does not receive parameters', async () => {
      const response = {
        item,
      };
      jest.spyOn(service, 'list').mockResolvedValueOnce(response);
      const output = await sut.list();
      expect(output).toEqual(response);
    });

    it('should return a complete list of products with pagination', async () => {
      const total = faker.number.int({ min: 1, max: 100 });
      const response = {
        item,
        meta: {
          totalItems: total,
          itemCount: item.length,
          itemsPerPage: params.limit,
          totalPages: Math.ceil(total / params.limit),
          currentPage: params.page,
        },
      };
      jest.spyOn(service, 'list').mockResolvedValueOnce(response);
      const output = await sut.list(params);
      expect(output).toEqual(response);
    });
  });
  describe('Show', () => {
    const name: string = faker.commerce.productName();
    it('should call the show method of the service with correct parameter', async () => {
      const ShowSpy = jest.spyOn(service, 'show');
      await sut.show(name);
      expect(ShowSpy).toHaveBeenCalledWith(name);
    });
    it('should throw Parameter not found error if it is not passed', async () => {
      const promise = sut.show('');
      await expect(promise).rejects.toThrow(new ParamNotFound());
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'show').mockRejectedValueOnce(new Error('Error'));

      const promise = sut.show(name);
      await expect(promise).rejects.toThrow();
    });
    it('should return a products', async () => {
      const response = {
        item: [
          {
            name,
            price: Number(faker.commerce.price()),
            quantity: faker.number.int({ min: 0, max: 100 }),
          },
        ],
      };
      jest.spyOn(service, 'show').mockResolvedValueOnce(response);
      const output = await sut.show(name);
      expect(output).toEqual(response);
    });
  });
});
