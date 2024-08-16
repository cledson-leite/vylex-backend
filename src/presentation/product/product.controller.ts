import { CreateDto } from '@/shared/dto';
import { ParamNotFound } from '@/shared/errors';
import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}
  @Post()
  async create(@Body() params: CreateDto) {
    const { name, price, quantity } = params;
    if (!name || !price || !quantity) {
      throw new ParamNotFound();
    }
    return this.service.create(params);
  }
}
