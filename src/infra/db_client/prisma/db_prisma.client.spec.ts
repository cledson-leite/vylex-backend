import { PrismaService } from '@/presentation/prisma/prisma.service';
import { PaginationDto, ResponseDto } from '@/shared/dto';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DbPrismaClient } from '.';

describe('Db Prisma Client', () => {
  const dto = {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    quantity: faker.number.int({ min: 0, max: 100 }),
  };
  let prisma: PrismaService;
  let sut: DbPrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbPrismaClient,
        {
          provide: 'prisma',
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    prisma = module.get<PrismaService>('prisma');
    sut = module.get<DbPrismaClient>(DbPrismaClient);
  });
  describe('Save', () => {
    it('should call the create method with the correct data', async () => {
      sut.save(dto);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('should throw error received from client', async () => {
      jest
        .spyOn(prisma.product, 'create')
        .mockRejectedValueOnce(new Error('Error'));
      await expect(sut.save(dto)).rejects.toThrow();
    });
  });
  describe('FindAll', () => {
    const dto: PaginationDto = {
      page: faker.number.int({ min: 1, max: 10 }),
      limit: faker.number.int({ min: 1, max: 10 }),
    };
    const total = faker.number.int({ min: 1, max: 100 });
    const item = Array(dto.limit)
      .fill(null)
      .map(() => ({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        quantity: faker.number.int({ min: 0, max: 100 }),
      }));
    const response: ResponseDto = {
      item,
      meta: {
        totalItems: total,
        itemCount: item.length,
        itemsPerPage: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
        currentPage: dto.page,
      },
    };
    it('implement call the find all method without parameter', async () => {
      sut.getAll();
      expect(prisma.product.findMany).toHaveBeenCalledWith();
    });

    it('should throw error received from client', async () => {
      jest
        .spyOn(prisma.product, 'findMany')
        .mockRejectedValueOnce(new Error('Error'));
      await expect(sut.getAll()).rejects.toThrow();
    });
    it('should return an empty array', async () => {
      jest.spyOn(prisma.product, 'findMany').mockResolvedValueOnce([]);
      const result = await sut.getAll();
      expect(result).toEqual({});
    });
    it('should return a list of products without pagination', async () => {
      jest
        .spyOn(prisma.product, 'findMany')
        .mockResolvedValueOnce(response.item as any);
      const result = await sut.getAll();
      expect(result).toEqual({ item: [...response.item] });
    });
    it('should return a list of products with pagination', async () => {
      jest
        .spyOn(prisma.product, 'findMany')
        .mockResolvedValueOnce(response.item as any);
      jest.spyOn(prisma.product, 'count').mockResolvedValueOnce(total);
      const result = await sut.getAll(dto);
      expect(result).toEqual(response);
    });
  });
});
