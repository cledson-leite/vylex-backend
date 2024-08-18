import { CreateDto, PaginationDto, UpdateDto } from '@/shared/dto';
import { ParamNotFound } from '@/shared/errors';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
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

  @Get()
  async list(@Query() queries?: PaginationDto) {
    if (!queries) return this.service.list();
    const dto = {
      page: Number(queries.page),
      limit: Number(queries.limit),
    };
    return this.service.list(dto);
  }

  @Get('/:name')
  async show(@Param('name') name: string) {
    if (!name) {
      throw new ParamNotFound();
    }
    return this.service.show(name);
  }

  @Put('/:name')
  async update(@Param('name') name: string, @Body() params: UpdateDto) {
    if (!name) {
      throw new ParamNotFound();
    }
    const dto = {
      ...params,
      name,
    };
    return this.service.update(dto);
  }
}
