import { ICreateProductRepository } from '@/application/protocol/reposirory/create_product.interface.repository';
import { ICreateProductClient } from '@/data/source/create_product_client.interface..source';
import { faker } from '@faker-js/faker';
import { CreateProductRepository } from '.';
describe('Create Product Repository', () => {
  const dto = {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    quantity: faker.number.int({ min: 0, max: 100 }),
  };
  let source: ICreateProductClient;
  let sut: ICreateProductRepository;

  beforeAll(() => {
    source = {
      save: jest.fn(),
    };
    sut = new CreateProductRepository(source);
  });
  it('should call the source with correct parameters', async () => {
    sut.create(dto);
    expect(source.save).toHaveBeenCalledWith(dto);
  });
  it('should throw errors received by source', async () => {
    jest.spyOn(source, 'save').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.create(dto);
    await expect(promise).rejects.toThrow();
  });
});
