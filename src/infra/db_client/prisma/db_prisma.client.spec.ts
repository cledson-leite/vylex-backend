import { PrismaService } from '@/presentation/prisma/prisma.service';
import { PaginationDto, ResponseDto, UpdateDto } from '@/shared/dto';
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
              findUnique: jest.fn(),
              update: jest.fn(),
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
    it('should call the find all method without parameter', async () => {
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
  describe('Find', () => {
    const name: string = faker.commerce.productName();
    const response: ResponseDto = {
      item: [
        {
          name,
          price: Number(faker.commerce.price()),
          quantity: faker.number.int({ min: 0, max: 100 }),
        },
      ],
    };
    it('should call the find method with correct parameter', async () => {
      sut.get(name);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { name },
      });
    });
    it('should throw error received from client', async () => {
      jest
        .spyOn(prisma.product, 'findUnique')
        .mockRejectedValueOnce(new Error('Error'));
      await expect(sut.get(name)).rejects.toThrow();
    });
    it('should return an empty array', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValueOnce(null);
      const output = await sut.get(name);
      expect(output).toEqual({});
    });
    it('should return a product', async () => {
      jest
        .spyOn(prisma.product, 'findUnique')
        .mockResolvedValueOnce(response.item[0] as any);
      const output = await sut.get(name);
      expect(output).toEqual(response);
    });
  });
  describe('Update', () => {
    const dto: UpdateDto = {
      name: faker.commerce.productName(),
      proprity: 'price',
      value: Number(faker.commerce.price()),
    };
    const data = { [dto.proprity]: dto.value };
    it('should call the update method with correct parameter', async () => {
      await sut.update(dto);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { name: dto.name },
        data,
      });
    });
    it('should throw error received from update', async () => {
      jest
        .spyOn(prisma.product, 'update')
        .mockRejectedValueOnce(new Error('Error'));
      await expect(sut.update(dto)).rejects.toThrow();
    });
  });
});
