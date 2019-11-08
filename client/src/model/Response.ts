class Response<T = any> {
    status: number;
    error: string;
    data: T | T[];
}

export default Response;