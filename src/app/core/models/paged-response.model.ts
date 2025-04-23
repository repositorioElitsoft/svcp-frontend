export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
    last: boolean;
    first: boolean;
    empty: boolean;
} 