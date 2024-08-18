import { IShowProductClient } from '@/data/source/show_product_client.interface';
import { faker } from '@faker-js/faker';
import { ShowProductRepository } from '.';

describe('Show Product Repository', () => {
  let source: IShowProductClient;
  let sut: ShowProductRepository;
  beforeEach(() => {
    source = {
      get: jest.fn(),
    };
    sut = new ShowProductRepository(source);
  });
  it('should call source with correct parameter', async () => {
    const name = faker.commerce.productName();
    await sut.show(name);
    expect(source.get).toHaveBeenCalledWith(name);
  });
  it('should throw errors received by source', async () => {
    const name = faker.commerce.productName();
    jest.spyOn(source, 'get').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.show(name);
    await expect(promise).rejects.toThrow();
  });
  it('should return product', async () => {
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
    jest.spyOn(source, 'get').mockResolvedValueOnce(response);
    const output = await sut.show(name);
    expect(output).toEqual(response);
  });
});
