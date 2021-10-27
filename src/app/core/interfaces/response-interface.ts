export interface ResponseInterface {
    success?: boolean;
    code?: number;
    message?: string;
    error?: any;
    data?: {} | [] | any;
}
