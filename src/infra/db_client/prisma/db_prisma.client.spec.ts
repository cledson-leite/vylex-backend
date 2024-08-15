import { ICreateProductClient } from '@/data/source/create_product_client.interface..source';
import { PrismaService } from '@/presentation/prisma/prisma.service';
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
  let sut: ICreateProductClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbPrismaClient,
        {
          provide: 'dbPrismaClient',
          useValue: {
            product: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    prisma = module.get<PrismaService>('dbPrismaClient');
    sut = module.get<DbPrismaClient>(DbPrismaClient);
  });
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
