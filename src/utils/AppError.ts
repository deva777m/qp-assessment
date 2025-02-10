class AppError extends Error {
    readonly statusCode: number;
    readonly message: string;
    readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;