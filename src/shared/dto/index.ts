export interface CreateDto {
  name: string;
  quantity: number;
  price: number;
}
export interface UpdateDto {
  name: string;
  proprity: string;
  value: any;
}
export interface MetaDto {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ResponseDto {
  item: CreateDto[];
  meta?: MetaDto;
}
export interface PaginationDto {
  page: number;
  limit?: number;
}
