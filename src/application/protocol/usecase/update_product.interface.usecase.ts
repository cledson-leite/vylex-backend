import { UpdateDto } from '@/shared/dto';

export interface IUpdateProductUseCase {
  execute: (dto: UpdateDto) => Promise<void>;
}
