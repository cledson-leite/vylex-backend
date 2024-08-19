import { IDeleteProductRepository } from '@/application/protocol/reposirory/delete_product.interface.repository';
import { IDeleteProductClient } from '@/data/source/delete_product_client.interface';
import { faker } from '@faker-js/faker';
import { DeleteProductRepository } from '.';

describe('Delete Product Repository', () => {
  const name = faker.commerce.productName();
  let source: IDeleteProductClient;
  let sut: IDeleteProductRepository;
  beforeAll(() => {
    source = {
      delete: jest.fn(),
    };
    sut = new DeleteProductRepository(source);
  });
  it('should call source with correct parameters', async () => {
    await sut.delete(name);
    expect(source.delete).toHaveBeenCalledWith(name);
  });
  it('should throw errors received by source', async () => {
    jest.spyOn(source, 'delete').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.delete(name);
    await expect(promise).rejects.toThrow();
  });
});
