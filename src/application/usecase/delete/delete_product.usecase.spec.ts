import { IDeleteProductRepository } from '@/application/protocol/reposirory/delete_product.interface.repository';
import { IDeleteProductUseCase } from '@/application/protocol/usecase/delete_product.interface.usecase';
import { faker } from '@faker-js/faker';
import { DeleteProductUseCase } from '.';

describe('Delete Product Use Case', () => {
  const name = faker.commerce.productName();
  let repository: IDeleteProductRepository;
  let sut: IDeleteProductUseCase;
  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    };
    sut = new DeleteProductUseCase(repository);
  });
  it('should call the repository with correct parameters', async () => {
    await sut.execute(name);
    expect(repository.delete).toHaveBeenCalledWith(name);
  });
  it('should throw "Parameter not found" error if it doesnt receive them', async () => {
    const promise = sut.execute('');
    expect(promise).rejects.toThrow('Parameter not found');
  });
  it('should throw error received from repository', async () => {
    jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.execute(name);
    expect(promise).rejects.toThrow('Error');
  });
});
