import { PaginationDto, ResponseDto } from '@/shared/dto';

export interface IListProductsUsecase {
  execute: (dto?: PaginationDto) => Promise<ResponseDto>;
}
