import { IDeleteProductRepository } from '@/application/protocol/reposirory/delete_product.interface.repository';
import { IDeleteProductClient } from '@/data/source/delete_product_client.interface';

export class DeleteProductRepository implements IDeleteProductRepository {
  constructor(private source: IDeleteProductClient) {}
  async delete(name: string): Promise<void> {
    await this.source.delete(name);
  }
}
