export interface ApiEntityResponse<T> {
    data: T;
    errorCode?: string;
    errorMessage?: string;
    errors?: ApiError[];
}

export interface ApiError {
    errorCode: string;
    errorMessage: string;
}
