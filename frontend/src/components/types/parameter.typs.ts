export interface PaginationTypes {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalItems: number;
}

export interface FunctionTypes<T> {
    status: 0 | 1;
    message: string;
    data: T
    pagination?: PaginationTypes,
     todayCount?: number;
}

export interface FunctionParams {
    page?: number;
    limit?: number;
    search?: string;
}