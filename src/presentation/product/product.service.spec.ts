import { ICreateProductUsecase } from '@/application/protocol/usecase/create_product.interface.usecase';
import { IDeleteProductUseCase } from '@/application/protocol/usecase/delete_product.interface.usecase';
import { IListProductsUsecase } from '@/application/protocol/usecase/list_products.interface.usecase';
import { IShowProductUseCase } from '@/application/protocol/usecase/show_product.interface.usecase';
import { IUpdateProductUseCase } from '@/application/protocol/usecase/update_product.interface.usecase';
import { CreateDto, PaginationDto, ResponseDto, UpdateDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('Product Service', () => {
  let create: ICreateProductUsecase;
  let list: IListProductsUsecase;
  let show: IShowProductUseCase;
  let update: IUpdateProductUseCase;
  let deleteService: IDeleteProductUseCase;
  let sut: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'CreateProductUseCase',
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'ListProductUseCase',
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'ShowProductUseCase',
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'UpdateProductUseCase',
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: 'DeleteProductUseCase',
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();
    create = module.get<ICreateProductUsecase>('CreateProductUseCase');
    list = module.get<IListProductsUsecase>('ListProductUseCase');
    show = module.get<IShowProductUseCase>('ShowProductUseCase');
    update = module.get<IUpdateProductUseCase>('UpdateProductUseCase');
    deleteService = module.get<IDeleteProductUseCase>('DeleteProductUseCase');
    sut = module.get<ProductService>(ProductService);
  });

  describe('Create', () => {
    const dto: CreateDto = {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      quantity: faker.number.int({ min: 0, max: 100 }),
    };
    it('should call the create method of the use case with correct parameters', async () => {
      sut.create(dto);
      expect(create.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw error received from create use case', async () => {
      jest.spyOn(create, 'execute').mockRejectedValueOnce(new Error('Error'));
      const promise = sut.create(dto);
      await expect(promise).rejects.toThrow();
    });
  });
  describe('List', () => {
    const dto: PaginationDto = {
      page: faker.number.int({ min: 0, max: 100 }),
      limit: faker.number.int({ min: 0, max: 100 }),
    };
    const item = Array(dto.limit)
      .fill(null)
      .map(() => ({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        quantity: faker.number.int({ min: 0, max: 100 }),
      }));
    it('should call the list method of the use case without parameters', async () => {
      sut.list();
      expect(list.execute).toHaveBeenCalledWith();
    });
    it('should call the list method of the use case with correct parameters', async () => {
      sut.list(dto);
      expect(list.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw error received from create use case', async () => {
      jest.spyOn(list, 'execute').mockRejectedValueOnce(new Error('Error'));
      const promise = sut.list(dto);
      await expect(promise).rejects.toThrow();
    });
    it('should return a complete list of products if it does not receive parameters', async () => {
      const response = {
        item,
      };
      jest.spyOn(list, 'execute').mockResolvedValueOnce(response);
      const output = await sut.list();
      expect(output).toEqual(response);
    });
    it('should return a complete list of products with pagination', async () => {
      const total = faker.number.int({ min: 1, max: 100 });
      const response: ResponseDto = {
        item,
        meta: {
          totalItems: total,
          itemCount: item.length,
          itemsPerPage: dto.limit,
          totalPages: Math.ceil(total / dto.limit),
          currentPage: dto.page,
        },
      };
      jest.spyOn(list, 'execute').mockResolvedValueOnce(response);
      const output = await sut.list(dto);
      expect(output).toEqual(response);
    });
  });
  describe('Show', () => {
    const name: string = faker.commerce.productName();
    it('should call the show method of the use case', async () => {
      sut.show(name);
      expect(show.execute).toHaveBeenCalledWith(name);
    });
    it('should throw error received from show use case', async () => {
      jest.spyOn(show, 'execute').mockRejectedValueOnce(new Error('Error'));
      const promise = sut.show(name);
      await expect(promise).rejects.toThrow();
    });
    it('should return a product', async () => {
      const response = {
        item: [
          {
            name,
            price: Number(faker.commerce.price()),
            quantity: faker.number.int({ min: 0, max: 100 }),
          },
        ],
      };
      jest.spyOn(list, 'execute').mockResolvedValueOnce(response);
      const output = await sut.list();
      expect(output).toEqual(response);
    });
  });
  describe('Update', () => {
    const dto: UpdateDto = {
      name: faker.commerce.productName(),
      proprity: 'price',
      value: Number(faker.commerce.price()),
    };
    it('should call the update method of the use case', async () => {
      sut.update(dto);
      expect(update.execute).toHaveBeenCalledWith(dto);
    });
    it('should throw error received from update use case', async () => {
      jest.spyOn(update, 'execute').mockRejectedValueOnce(new Error('Error'));
      const promise = sut.update(dto);
      expect(() => promise).rejects.toThrow();
    });
  });
  describe('Delete', () => {
    const name: string = faker.commerce.productName();
    it('should call the delete method of the use case', async () => {
      sut.delete(name);
      expect(deleteService.execute).toHaveBeenCalledWith(name);
    });
    it('should throw error received from delete use case', async () => {
      jest
        .spyOn(deleteService, 'execute')
        .mockRejectedValueOnce(new Error('Error'));
      const promise = sut.delete(name);
      await expect(promise).rejects.toThrow();
    });
  });
});
