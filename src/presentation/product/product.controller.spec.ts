import { CreateProductUseCase } from '@/application/usecase/create';
import { DeleteProductUseCase } from '@/application/usecase/delete';
import { ListProductsUseCase } from '@/application/usecase/list';
import { ShowProductUseCase } from '@/application/usecase/show';
import { UpdateProductUseCase } from '@/application/usecase/update';
import { CreateProductRepository } from '@/data/repository/create';
import { DeleteProductRepository } from '@/data/repository/delete';
import { ListProductRepository } from '@/data/repository/list';
import { ShowProductRepository } from '@/data/repository/show';
import { UpdateProductRepository } from '@/data/repository/update';
import { DbPrismaClient } from '@/infra/db_client/prisma';
import { PaginationDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let response: Response;
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
          provide: 'DeleteRepository',
          useFactory: client => new DeleteProductRepository(client),
          inject: ['db'],
        },
        {
          provide: 'UpdateRepository',
          useFactory: client => new UpdateProductRepository(client),
          inject: ['db'],
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
          provide: 'DeleteProductUseCase',
          useFactory: repository => new DeleteProductUseCase(repository),
          inject: ['DeleteRepository'],
        },
        {
          provide: 'UpdateProductUseCase',
          useFactory: repository => new UpdateProductUseCase(repository),
          inject: ['UpdateRepository'],
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
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    jest.clearAllMocks();
  });

  describe('Create', () => {
    const params = {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      quantity: faker.number.int({ min: 0, max: 100 }),
    };
    it('should call the create method of the service with correct parameter', async () => {
      const createSpy = jest.spyOn(service, 'create');
      await sut.create(params, response);
      expect(createSpy).toHaveBeenCalledWith(params);
    });
    it('should throw Parameter not found error if it is not passed', async () => {
      await sut.create({} as any, response);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Parameter not found',
      });
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('Error'));
      await sut.create(params, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Error',
      });
    });
    it('should returns status 204', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce();
      await sut.create(params, response);
      expect(response.status).toHaveBeenCalledWith(204);
      expect(response.send).toHaveBeenCalled();
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
      await sut.list(response, params);
      expect(listSpy).toHaveBeenCalledWith(params);
    });
    it('should call the service without parameter', async () => {
      const listSpy = jest.spyOn(service, 'list');
      await sut.list(response);
      expect(listSpy).toHaveBeenCalledWith();
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'list').mockRejectedValueOnce(new Error('Error'));
      await sut.list(response, {} as any);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Error',
      });
    });

    it('should return a complete list of products if it does not receive parameters', async () => {
      const res = {
        item,
      };
      jest.spyOn(service, 'list').mockResolvedValueOnce(res);
      await sut.list(response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(res);
    });

    it('should return a complete list of products with pagination', async () => {
      const total = faker.number.int({ min: 1, max: 100 });
      const res = {
        item,
        meta: {
          totalItems: total,
          itemCount: item.length,
          itemsPerPage: params.limit,
          totalPages: Math.ceil(total / params.limit),
          currentPage: params.page,
        },
      };
      jest.spyOn(service, 'list').mockResolvedValueOnce(res);
      await sut.list(response, params);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(res);
    });
  });
  describe('Show', () => {
    const name: string = faker.commerce.productName();
    it('should call the show method of the service with correct parameter', async () => {
      const ShowSpy = jest.spyOn(service, 'show');
      await sut.show(name, response);
      expect(ShowSpy).toHaveBeenCalledWith(name);
    });
    it('should throw Parameter not found error if it is not passed', async () => {
      await sut.show('', response);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Parameter not found',
      });
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'show').mockRejectedValueOnce(new Error('Error'));

      await sut.show(name, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Error',
      });
    });
    it('should return a products', async () => {
      const resp = {
        item: [
          {
            name,
            price: Number(faker.commerce.price()),
            quantity: faker.number.int({ min: 0, max: 100 }),
          },
        ],
      };
      jest.spyOn(service, 'show').mockResolvedValueOnce(resp);
      await sut.show(name, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(resp);
    });
  });
  describe('Update', () => {
    const params = {
      name: faker.commerce.productName(),
      proprity: 'price',
      value: Number(faker.commerce.price()),
    };
    it('should call the update method of the service with correct parameter', async () => {
      const updateSpy = jest.spyOn(service, 'update');
      await sut.update(params.name, params, response);
      expect(updateSpy).toHaveBeenCalledWith(params);
    });
    it('should throw Parameter not found error if name is not passed', async () => {
      await sut.update('', params, response);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Parameter not found',
      });
    });
    it('should throw Parameter not found error if params is not passed', async () => {
      await sut.update(params.name, {} as any, response);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Parameter not found',
      });
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error('Error'));

      await sut.update(params.name, params, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Error',
      });
    });
    it('should returns status 200', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce();
      await sut.update(params.name, params, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith();
    });
  });
  describe('Delete', () => {
    const name: string = 'keyboard';
    it('should throw error received from service', async () => {
      await sut.delete('', response);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Parameter not found',
      });
    });
    it('should call the delete method of the service with correct parameter', async () => {
      const deleteSpy = jest.spyOn(service, 'delete');
      await sut.delete(name, response);
      expect(deleteSpy).toHaveBeenCalledWith(name);
    });
    it('should throw error received from service', async () => {
      jest.spyOn(service, 'delete').mockRejectedValueOnce(new Error('Error'));
      await sut.delete(name, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Error',
      });
    });
    it('should returns status 200', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce();
      await sut.delete(name, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith();
    });
  });
});
