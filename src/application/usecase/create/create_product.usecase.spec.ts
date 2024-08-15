import { ICreateProductRepository } from '@/application/protocol/reposirory/create_product.interface.repository';
import { faker } from '@faker-js/faker';
import { CreateProductUseCase } from '.';

describe('Create Product', () => {
  const dto = {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    quantity: faker.number.int({ min: 0, max: 100 }),
  };
  let repository: ICreateProductRepository;
  let sut: CreateProductUseCase;
  beforeAll(() => {
    repository = {
      create: jest.fn(),
    };
    sut = new CreateProductUseCase(repository);
  });
  it('should throw "Parameter not found" error if it doesnt receive them', async () => {
    const promise = sut.execute({} as any);
    expect(promise).rejects.toThrow('Parameter not found');
  });
  it('should call the repository with correct parameters', async () => {
    await sut.execute(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should throw error received from repository', async () => {
    jest.spyOn(repository, 'create').mockRejectedValueOnce(new Error('Error'));
    expect(sut.execute(dto)).rejects.toThrow('Error');
  });
});
