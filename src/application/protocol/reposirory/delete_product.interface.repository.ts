export interface IDeleteProductRepository {
  delete: (name: string) => Promise<void>;
}
