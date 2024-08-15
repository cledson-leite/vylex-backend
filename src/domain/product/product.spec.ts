import { faker } from '@faker-js/faker';
import { ProductBuilder } from '.';

describe('Product', () => {
  let builder: ProductBuilder;
  beforeAll(() => {
    builder = new ProductBuilder();
  });
  it('should create a product', () => {
    const product = builder.build();
    expect(product.name).toBeUndefined();
    expect(product.quantity).toBeUndefined();
    expect(product.price).toBeUndefined();
  });
  it('should create a product with name', () => {
    const productName = faker.commerce.productName();
    const product = builder.withName(productName).build();
    expect(product.name).toBe(productName);
  });
  it('should create a product with quantity', () => {
    const productQuantity = faker.number.int({ min: 1, max: 100 });
    const product = builder.withQuantity(productQuantity).build();
    expect(product.quantity).toBe(productQuantity);
  });
  it('should create a product with price', () => {
    const productPrice = Number(faker.commerce.price());
    const product = builder.withPrice(productPrice).build();
    expect(product.price).toBe(productPrice);
  });
  it('should create a product with name, quantity and price', () => {
    const productName = faker.commerce.productName();
    const productQuantity = faker.number.int({ min: 1, max: 100 });
    const productPrice = Number(faker.commerce.price());
    const product = builder
      .withName(productName)
      .withQuantity(productQuantity)
      .withPrice(productPrice)
      .build();
    expect(product.name).toBe(productName);
    expect(product.quantity).toBe(productQuantity);
    expect(product.price).toBe(productPrice);
  });
});
