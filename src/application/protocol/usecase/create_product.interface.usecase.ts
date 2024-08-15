import { CreateDto } from '@/shared/dto';

export interface ICreateProductUsecase {
  execute: (dto: CreateDto) => Promise<void>;
}
