export interface IDeleteProductClient {
  delete: (id: string) => Promise<void>;
}
