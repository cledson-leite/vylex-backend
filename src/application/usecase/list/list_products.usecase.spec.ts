import { IListProductsRepository } from '@/application/protocol/reposirory/list_products.interface.repository';
import { PaginationDto, ResponseDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { ListProductsUseCase } from '.';
import { IListProductsUsecase } from '@/application/protocol/usecase/list_products.interface.usecase';

describe('List Products Use Case', () => {
  const dto: PaginationDto = {
    page: faker.number.int({ min: 1, max: 10 }),
    limit: faker.number.int({ min: 1, max: 10 }),
  };
  const response: ResponseDto = {
    item: [
      {
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        quantity: faker.number.int({ min: 0, max: 100 }),
      },
    ],
  };
  let repository: IListProductsRepository;
  let sut: IListProductsUsecase;

  beforeAll(() => {
    repository = {
      list: jest.fn(),
    };
    sut = new ListProductsUseCase(repository);
  });
  it('should call the repository without parameters', async () => {
    await sut.execute();
    expect(repository.list).toHaveBeenCalledWith();
  });
  it('should return a complete list of products if it does not receive parameters', async () => {
    jest.spyOn(repository, 'list').mockResolvedValueOnce(response);
    const output = await sut.execute();
    expect(output).toEqual(response);
  });
  it('should throw error received from repository', async () => {
    const error = new Error('Error');
    jest.spyOn(repository, 'list').mockRejectedValueOnce(error);
    const promise = sut.execute();
    expect(promise).rejects.toThrow(error);
  });
  it('should call the repository with corrects parameters', async () => {
    await sut.execute(dto);
    expect(repository.list).toHaveBeenCalledWith(dto);
  });

  it('should return an empty list if it does not receive a product from the repository', async () => {
    jest.spyOn(repository, 'list').mockResolvedValueOnce(null);
    const output = await sut.execute(dto);
    expect(output).toEqual({});
  });
  it('should return a complete list with pagination on success', async () => {
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
    jest.spyOn(repository, 'list').mockResolvedValueOnce(response);
    const output = await sut.execute(dto);
    expect(output).toEqual(response);
  });
});
