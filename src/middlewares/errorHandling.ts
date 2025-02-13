import {NextFunction, Request, Response} from "express";
import errorHandler from "../utils/ErrorHandler";

const errorHandling = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('handling error....');
    const error = errorHandler(err);
    const errorCode = error.statusCode || 500;
    return res.status(errorCode).json({message: error.message});
}

export default errorHandling;