import { IListProductsRepository } from '@/application/protocol/reposirory/list_products.interface.repository';
import { IListProductClient } from '@/data/source/list_products_client.interface';
import { PaginationDto, ResponseDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { ListProductRepository } from '.';
describe('List Product Repository', () => {
  const dto: PaginationDto = {
    page: faker.number.int({ min: 1, max: 10 }),
    limit: faker.number.int({ min: 1, max: 10 }),
  };
  const total = faker.number.int({ min: 1, max: 100 });
  const response: ResponseDto = {
    item: Array(dto.limit)
      .fill(null)
      .map(() => ({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        quantity: faker.number.int({ min: 0, max: 100 }),
      })),
    meta: {
      totalItems: total,
      itemCount: faker.number.int({ min: 1, max: 100 }),
      itemsPerPage: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
      currentPage: dto.page,
    },
  };
  let source: IListProductClient;
  let sut: IListProductsRepository;

  beforeAll(() => {
    source = {
      getAll: jest.fn(),
    };
    sut = new ListProductRepository(source);
  });
  it('should call the empty source if it does not receive parameters', async () => {
    await sut.list();
    expect(source.getAll).toHaveBeenCalledWith();
  });
  it('should throw error received from source', async () => {
    jest.spyOn(source, 'getAll').mockRejectedValueOnce(new Error('Error'));
    const promise = sut.list();
    await expect(promise).rejects.toThrow();
  });
  it('should return list of products without pagination', async () => {
    const response = {
      item: Array(dto.limit)
        .fill(null)
        .map(() => ({
          name: faker.commerce.productName(),
          price: Number(faker.commerce.price()),
          quantity: faker.number.int({ min: 0, max: 100 }),
        })),
    };
    jest.spyOn(source, 'getAll').mockResolvedValueOnce(response);
    const output = await sut.list();
    expect(output).toEqual(response);
  });
  it('should call the source with correct parameters', async () => {
    sut.list(dto);
    expect(source.getAll).toHaveBeenCalledWith(dto);
  });
  it('should return list of products with pagination', async () => {
    jest.spyOn(source, 'getAll').mockResolvedValueOnce(response);
    const output = await sut.list(dto);
    expect(output).toEqual(response);
  });
});
