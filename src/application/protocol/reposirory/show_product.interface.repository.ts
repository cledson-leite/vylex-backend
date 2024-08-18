import { ResponseDto } from '@/shared/dto';

export interface IShowProductRepository {
  show: (name: string) => Promise<ResponseDto>;
}
