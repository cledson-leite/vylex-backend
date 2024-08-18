import { UpdateDto } from '@/shared/dto';

export interface IUpdateProductRepository {
  update: (dto: UpdateDto) => Promise<void>;
}
