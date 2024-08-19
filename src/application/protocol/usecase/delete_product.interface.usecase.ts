export interface IDeleteProductUseCase {
  execute: (name: string) => Promise<void>;
}
