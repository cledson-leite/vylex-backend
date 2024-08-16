import { PaginationDto, ResponseDto } from '@/shared/dto';

export interface IListProductsRepository {
  list: (dto?: PaginationDto) => Promise<ResponseDto>;
}
