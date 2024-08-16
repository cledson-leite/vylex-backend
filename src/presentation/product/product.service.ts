import { ICreateProductUsecase } from '@/application/protocol/usecase/create_product.interface.usecase';
import { CreateDto } from '@/shared/dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @Inject('CreateProductUseCase')
    private readonly createUsecase: ICreateProductUsecase,
  ) {}
  async create(dto: CreateDto): Promise<void> {
    return this.createUsecase.execute(dto);
  }
}
