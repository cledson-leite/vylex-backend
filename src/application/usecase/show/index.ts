import { IShowProductRepository } from '@/application/protocol/reposirory/show_product.interface.repository';
import { IShowProductUseCase } from '@/application/protocol/usecase/show_product.interface.usecase';
import { ResponseDto } from '@/shared/dto';

export class ShowProductUseCase implements IShowProductUseCase {
  constructor(private readonly repository: IShowProductRepository) {}
  async execute(name: string): Promise<ResponseDto> {
    if (!name) {
      throw new Error('Parameter not found');
    }
    return this.repository.show(name);
  }
}
