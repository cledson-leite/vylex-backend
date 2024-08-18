import { ResponseDto } from '@/shared/dto';

export class IShowProductUseCase {
  execute: (name: string) => Promise<ResponseDto>;
}
