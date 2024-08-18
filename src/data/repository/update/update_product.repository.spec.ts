import { IUpdateProductRepository } from '@/application/protocol/reposirory/update_product.interface.repository';
import { IUpdateProductClient } from '@/data/source/uptade_product_client.interface';
import { UpdateDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { UpdateProductRepository } from '.';

describe('Update Product Repository', () => {
  const dto: UpdateDto = {
    name: faker.commerce.productName(),
    proprity: faker.lorem.word(),
    value: faker.number.int({ min: 0, max: 100 }),
  };
  let source: IUpdateProductClient;
  let sut: IUpdateProductRepository;
  beforeAll(() => {
    source = {
      update: jest.fn(),
    };
    sut = new UpdateProductRepository(source);
  });
  it('should call the source with correct parameters', async () => {
    sut.update(dto);
    expect(source.update).toHaveBeenCalledWith(dto);
  });
  it('should throw errors received by source', async () => {
    jest.spyOn(source, 'update').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.update(dto);
    await expect(promise).rejects.toThrow();
  });
});
