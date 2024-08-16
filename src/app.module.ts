import { Module } from '@nestjs/common';
import { PrismaModule } from './presentation/prisma/prisma.module';
import { ProductModule } from './presentation/product/product.module';

@Module({
  imports: [PrismaModule, ProductModule],
})
export class AppModule {}
