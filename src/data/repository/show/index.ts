import { IShowProductClient } from '@/data/source/show_product_client.interface';

export class ShowProductRepository {
  constructor(private source: IShowProductClient) {}

  async show(name: string) {
    name;
    return this.source.get(name);
  }
}
