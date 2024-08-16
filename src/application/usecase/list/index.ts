import { IListProductsRepository } from '@/application/protocol/reposirory/list_products.interface.repository';
import { IListProductsUsecase } from '@/application/protocol/usecase/list_products.interface.usecase';
import { PaginationDto, ResponseDto } from '@/shared/dto';

export class ListProductsUseCase implements IListProductsUsecase {
  constructor(private readonly repository: IListProductsRepository) {}
  async execute(dto?: PaginationDto): Promise<ResponseDto> {
    if (!dto || !dto.page || !dto.limit) {
      return this.repository.list();
    }
    const response = await this.repository.list(dto);
    if (!response) return {} as ResponseDto;
    return response;
  }
}
