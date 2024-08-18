import { IUpdateProductClient } from '@/data/source/uptade_product_client.interface';
import { UpdateDto } from '@/shared/dto';

export class UpdateProductRepository {
  constructor(private source: IUpdateProductClient) {}
  async update(dto: UpdateDto): Promise<void> {
    await this.source.update(dto);
  }
}
