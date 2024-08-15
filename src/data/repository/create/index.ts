import { ICreateProductRepository } from '@/application/protocol/reposirory/create_product.interface.repository';
import { IProductClient } from '@/data/source/product_client.interface..source';
import { CreateDto } from '@/shared/dto';

export class CreateProductRepository implements ICreateProductRepository {
  constructor(private source: IProductClient) {}
  async create(data: CreateDto): Promise<void> {
    return this.source.save(data);
  }
}
