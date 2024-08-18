import { PaginationDto, ResponseDto } from '@/shared/dto';

export interface IListProductClient {
  getAll(dto?: PaginationDto): Promise<ResponseDto>;
}
