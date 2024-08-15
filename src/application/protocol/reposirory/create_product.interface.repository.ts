import { CreateDto } from '@/shared/dto';

export interface ICreateProductRepository {
  create: (dto: CreateDto) => Promise<void>;
}
