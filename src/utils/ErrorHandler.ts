import AppError from "./AppError";

const errorHandler = (error: Error | AppError) => {
    
    if (error instanceof AppError) {
        // log error
        if(!error.isOperational) {
            // handle non operational errors
            // close dependencies, etc
            // add critical error logging
            console.error("Critical error", error);
            process.exit(1);
        }
        console.error('AppError', error);
        return error;
    }

    // log error
    console.error('Error', error);
    return new AppError(error.message, 500);
};

export default errorHandler;