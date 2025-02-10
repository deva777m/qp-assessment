import jwt, { JwtPayload } from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import {jwtConfig} from '../config';
import AppError from '../utils/AppError';

export const jwtAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json("Token is required");
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret!);
        const user = decoded as JwtPayload;
        if(user && user.id) {
            req.body.userId = user.id;
            req.body.role = user.role;
        } else {
            throw new AppError('User Not Found', 401);
        }
        next();
    } catch (error) {
        next(error);
    }
};

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
    if(req.body.role !== 'admin') {
        return res.status(401).json("Unauthorized");
    }
    next();
}