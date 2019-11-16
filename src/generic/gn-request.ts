
export interface GnRequest {
    gnCustomMapper?: boolean;
    gnExtract?: {
        [key: string]: any
    };
    gnFilters?: {
        [key: string]: string
    };
    gnOrder?: 'asc' | 'desc';
    gnPageIndex?: number;
    gnPageSize?: number;
    gnPath?: string;
    gnSort?: string;
}
