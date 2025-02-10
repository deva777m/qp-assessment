import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../db/models/User';
import AppError from '../utils/AppError';
import { jwtConfig } from '../config';


// Define schema for the user
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').required(),
    password: Joi.string().min(6).max(10).required(),
});

// Define schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
});

const userHandlers = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.body.user.id;
        try {
            if(!id) { 
                throw new AppError("Name is required", 400);
            }
            // Get the user by id
            const user = await User.findOne({
                where: {
                    id
                }
            });
            
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    post: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const { error, value } = userSchema.validate(req.body);
            if (error) {
                throw new AppError(error.details[0].message, 400);
            }

            const existingUser = await User.findOne({
                where: {
                    email: value.email
                }
            });

            if(existingUser && existingUser.id) {
                throw new AppError("User already exists", 400);
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(value.password, 10);
            
            // Create a new user
            const newUser = new User({...value, password: hashedPassword});
            await newUser.save();

            // remove password from the response
            res.status(201).json({...newUser.dataValues, password: undefined});
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body against the login schema
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                throw new AppError(error.details[0].message, 400);
            }
            
            const { email, password } = value;

            // Find the user by email
            const user = await User.findOne({ 
                where: {
                    email
                }        
            });
            if (!user) {
                throw new AppError("Invalid email", 401);
            }

            // Compare the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new AppError("Invalid email or password", 401);
            }

            // Generate an access token
            if (!jwtConfig.secret) {
                throw new AppError("JWT secret is not defined", 500);
            }

            const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    },
}

export default userHandlers;