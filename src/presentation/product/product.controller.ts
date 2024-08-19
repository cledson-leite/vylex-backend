import { CreateDto, PaginationDto, UpdateDto } from '@/shared/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}
  @Post()
  async create(@Body() params: CreateDto, @Res() response: Response) {
    const { name, price, quantity } = params;
    if (!name || !price || !quantity) {
      return response.status(400).send({ message: 'Parameter not found' });
    }
    try {
      await this.service.create(params);
      return response.status(204).send();
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get()
  async list(@Res() response: Response, @Query() queries?: PaginationDto) {
    try {
      if (!queries) {
        const products = await this.service.list();
        return response.status(200).send(products);
      }
      const dto = {
        page: Number(queries.page),
        limit: Number(queries.limit),
      };

      const products = await this.service.list(dto);
      return response.status(200).send(products);
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get('/:name')
  async show(@Param('name') name: string, @Res() response: Response) {
    if (!name) {
      return response.status(400).send({ message: 'Parameter not found' });
    }
    try {
      const product = await this.service.show(name);
      return response.status(200).send(product);
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Put('/:name')
  async update(
    @Param('name') name: string,
    @Body() params: UpdateDto,
    @Res() response: Response,
  ) {
    if (!name) {
      return response.status(400).send({ message: 'Parameter not found' });
    }
    const dto = {
      ...params,
      name,
    };
    if (!dto.proprity || !dto.value) {
      return response.status(400).send({ message: 'Parameter not found' });
    }
    try {
      await this.service.update(dto);
      return response.status(200).send();
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete('/:name')
  async delete(@Param('name') name: string, @Res() response: Response) {
    if (!name) {
      return response.status(400).send({ message: 'Parameter not found' });
    }
    try {
      await this.service.delete(name);
      return response.status(200).send();
    } catch (error) {
      return response.status(500).send({ message: error.message });
    }
  }
}
