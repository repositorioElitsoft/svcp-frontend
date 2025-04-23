export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    empty: boolean;
}