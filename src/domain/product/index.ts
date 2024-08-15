export class Product {
  private _name: string;
  private _quantity: number;
  private _price: number;

  private constructor(builder: ProductBuilder) {
    this._name = builder.name;
    this._quantity = builder.quantity;
    this._price = builder.price;
  }

  get name() {
    return this._name;
  }
  get quantity() {
    return this._quantity;
  }
  get price() {
    return this._price;
  }
  static create(builder: ProductBuilder) {
    return new Product(builder);
  }
}

export class ProductBuilder {
  private _name: string;
  private _quantity: number;
  private _price: number;

  get name() {
    return this._name;
  }
  get quantity() {
    return this._quantity;
  }
  get price() {
    return this._price;
  }

  withName(name: string) {
    this._name = name;
    return this;
  }
  withQuantity(quantity: number) {
    this._quantity = quantity;
    return this;
  }
  withPrice(price: number) {
    this._price = price;
    return this;
  }
  build() {
    return Product.create(this);
  }
}
