import { ICreateProductRepository } from '@/application/protocol/reposirory/create_product.interface.repository';
import { ICreateProductUsecase } from '@/application/protocol/usecase/create_product.interface.usecase';
import { CreateDto } from '@/shared/dto';
import { ParamNotFound } from '@/shared/errors';

export class CreateProductUseCase implements ICreateProductUsecase {
  constructor(private readonly repository: ICreateProductRepository) {}
  async execute(dto: CreateDto): Promise<void> {
    const { name, price, quantity } = dto;
    if (!name || !price || !quantity) {
      throw new ParamNotFound();
    }
    await this.repository.create(dto);
  }
}
