import { ICreateProductUsecase } from '@/application/protocol/usecase/create_product.interface.usecase';
import { IListProductsUsecase } from '@/application/protocol/usecase/list_products.interface.usecase';
import { CreateDto, PaginationDto } from '@/shared/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseDto } from '../../shared/dto/index';

@Injectable()
export class ProductService {
  constructor(
    @Inject('CreateProductUseCase')
    private readonly createUsecase: ICreateProductUsecase,
    @Inject('ListProductUseCase')
    private readonly listUsecase: IListProductsUsecase,
  ) {}
  async create(dto: CreateDto): Promise<void> {
    return this.createUsecase.execute(dto);
  }

  async list(dto?: PaginationDto): Promise<ResponseDto> {
    if (!dto) return this.listUsecase.execute();
    return this.listUsecase.execute(dto);
  }
}
