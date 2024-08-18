import { IListProductsRepository } from '@/application/protocol/reposirory/list_products.interface.repository';
import { IListProductClient } from '@/data/source/list_products_client.interface';
import { PaginationDto, ResponseDto } from '@/shared/dto';

export class ListProductRepository implements IListProductsRepository {
  constructor(private source: IListProductClient) {}

  async list(dto?: PaginationDto): Promise<ResponseDto> {
    if (!dto) return this.source.getAll();
    return this.source.getAll(dto);
  }
}
