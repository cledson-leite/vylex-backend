import { ICreateProductRepository } from '@/application/protocol/reposirory/create_product.interface.repository';
import { CreateDto } from '@/shared/dto';
import { ParamNotFound } from '@/shared/errors';

export class CreateProductUseCase {
  constructor(private readonly repository: ICreateProductRepository) {}
  async execute(dto: CreateDto): Promise<void> {
    const { name, price, quantity } = dto;
    if (!name || !price || !quantity) {
      throw new ParamNotFound();
    }
    await this.repository.create(dto);
  }
}
