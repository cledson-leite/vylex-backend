import { UpdateDto } from '@/shared/dto';

export interface IUpdateProductClient {
  update: (dto: UpdateDto) => Promise<void>;
}
