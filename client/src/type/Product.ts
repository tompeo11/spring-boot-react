export default interface Product {
    id: number
    name: string
    description: string
    unitPrice: number
    imageUrl: string
    unitsInStock: number
    brand: string
    categoryName: string
}

export interface ProductParams {
    sort: string;
    name? : string;
    categories?: string[];
    brands?: string[];
    pageNumber: number;
    pageSize: number;
}