export interface IPriceList {
    [brandName: string]: {
        [gradeName: string]: [{
            rate: number;
            isSizingApplicable: boolean;
            particulars: string;
            length?: number;
            width?: number;
            size?: string;
        }]
    };
}

export interface IOrder {
    brand: string;
    grade: string;
    size: string;
    particulars: string;
    quantity: number;
    rate: number;
    isSizingApplicable: boolean;
    length?: number;
    width?: number;
}

export interface IAvailableOption {
    brands: string[];
    grades: string[];
    sizes: string[];
    particularDetails: string[];
}
