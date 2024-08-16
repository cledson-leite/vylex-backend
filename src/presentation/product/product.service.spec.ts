import { ICreateProductUsecase } from '@/application/protocol/usecase/create_product.interface.usecase';
import { CreateDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('Product Service', () => {
  const dto: CreateDto = {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    quantity: faker.number.int({ min: 0, max: 100 }),
  };
  let create: ICreateProductUsecase;
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
      ],
    }).compile();
    create = module.get<ICreateProductUsecase>('CreateProductUseCase');
    sut = module.get<ProductService>(ProductService);
  });

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
