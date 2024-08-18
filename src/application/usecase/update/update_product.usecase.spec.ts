import { IUpdateProductRepository } from '@/application/protocol/reposirory/update_product.interface.repository';
import { faker } from '@faker-js/faker';
import { UpdateProductUseCase } from '.';

const randomProprity = () => {
  const proprities = ['name', 'quantity', 'price'];
  const index = faker.number.int({ min: 0, max: 2 });
  return proprities[index];
};

describe('Update Product Use Case', () => {
  const dto = {
    name: faker.commerce.productName(),
    proprity: randomProprity(),
    value: faker.number.int({ min: 0, max: 100 }),
  };
  let repository: IUpdateProductRepository;
  let sut: UpdateProductUseCase;

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    };
    sut = new UpdateProductUseCase(repository);
  });
  it('should throw "Parameter not found" error if it doesnt receive them', async () => {
    const promise = sut.execute({} as any);
    expect(promise).rejects.toThrow('Parameter not found');
  });
  it('should throw "Product not found error if property does not exist', async () => {
    const promise = sut.execute({ ...dto, proprity: 'property_invalid' });
    expect(promise).rejects.toThrow('Parameter not found');
  });
  it('should call the repository with correct parameters', async () => {
    await sut.execute(dto);
    expect(repository.update).toHaveBeenCalledWith(dto);
  });
});
