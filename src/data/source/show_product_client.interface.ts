import { ResponseDto } from '@/shared/dto';

export interface IShowProductClient {
  get(name: string): Promise<ResponseDto>;
}
