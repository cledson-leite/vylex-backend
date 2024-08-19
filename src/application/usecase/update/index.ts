import { IUpdateProductUseCase } from '@/application/protocol/usecase/update_product.interface.usecase';
import { UpdateDto } from '@/shared/dto';
import { IUpdateProductRepository } from '../../protocol/reposirory/update_product.interface.repository';

export class UpdateProductUseCase implements IUpdateProductUseCase {
  constructor(private readonly repository: IUpdateProductRepository) {}
  async execute(dto: UpdateDto): Promise<void> {
    const { name, proprity, value } = dto;
    const proprities = ['name', 'quantity', 'price'];
    if (!name || !proprity || !value) {
      throw new Error('Parameter not found');
    }
    if (!proprities.includes(proprity)) {
      throw new Error('Parameter not found');
    }
    await this.repository.update(dto);
  }
}
