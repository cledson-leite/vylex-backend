import { ICreateProductRepository } from '@/application/protocol/reposirory/create_product.interface.repository';
import { ICreateProductClient } from '@/data/source/create_product_client.interface..source';
import { CreateDto } from '@/shared/dto';

export class CreateProductRepository implements ICreateProductRepository {
  constructor(private source: ICreateProductClient) {}
  async create(data: CreateDto): Promise<void> {
    return this.source.save(data);
  }
}
