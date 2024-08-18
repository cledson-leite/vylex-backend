import { IDeleteProductRepository } from '@/application/protocol/reposirory/delete_product.interface.repository';
import { IDeleteProductUseCase } from '@/application/protocol/usecase/delete_product.interface.usecase';

export class DeleteProductUseCase implements IDeleteProductUseCase {
  constructor(private readonly repository: IDeleteProductRepository) {}
  async execute(name: string): Promise<void> {
    if (!name) {
      throw new Error('Parameter not found');
    }
    await this.repository.delete(name);
  }
}
