import { IShowProductRepository } from '@/application/protocol/reposirory/show_product.interface.repository';
import { IShowProductUseCase } from '@/application/protocol/usecase/show_product.interface.usecase';
import { faker } from '@faker-js/faker';
import { ShowProductUseCase } from '.';

describe('Show Product Use Case', () => {
  let repository: IShowProductRepository;
  let sut: IShowProductUseCase;
  beforeEach(() => {
    repository = {
      show: jest.fn(),
    };
    sut = new ShowProductUseCase(repository);
  });
  it('should throw "Parameter not found" error if it doesnt receive them', async () => {
    const promise = sut.execute('');
    expect(promise).rejects.toThrow('Parameter not found');
  });

  it('should call the repository with correct parameters', async () => {
    const name = faker.commerce.productName();
    await sut.execute(name);
    expect(repository.show).toHaveBeenCalledWith(name);
  });
  it('should throw error received from repository', async () => {
    const name = faker.commerce.productName();
    jest.spyOn(repository, 'show').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.execute(name);
    expect(promise).rejects.toThrow('Error');
  });
  it('should return a product if it does not receive an error', async () => {
    const name = faker.commerce.productName();
    const response = {
      item: [
        {
          name,
          price: Number(faker.commerce.price()),
          quantity: faker.number.int({ min: 0, max: 100 }),
        },
      ],
    };
    jest.spyOn(repository, 'show').mockResolvedValueOnce(response);
    const output = await sut.execute(name);
    expect(output).toEqual(response);
  });
});
