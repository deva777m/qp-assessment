import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Product from '../db/models/Product';
import AppError from '../utils/AppError';


// Define schema for the user
const productSchema = Joi.object({
    name: Joi.string().min(4).max(10).required(), 
    desc: Joi.string().max(1024).required(),
    price: Joi.number().min(0).required()
});

const productHandlers = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the all products
            const products = await Product.findAll();
            
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if(!id) { 
                throw new AppError("ProductId is required!", 400);
            }
            // Get the all products
            const product = await Product.findOne({
                where: {
                    id: Number(id)
                }
            });
            
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    },

    post: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            
            const {name, desc, price} = req.body;
            const productValues = {name, desc, price};
            const { error, value } = productSchema.validate(productValues);
            if (error) {
                throw new AppError(error.details[0].message, 400);
            }

            const existingProduct = await Product.findOne({
                where: {
                    name: value.name
                },
                paranoid: false
            });

            console.log(existingProduct);

            if(existingProduct && existingProduct.deletedAt) {
                throw new AppError("Product already exists, please restore it.", 400);
            }

            if(existingProduct && existingProduct.id) {
                throw new AppError("Product already exists", 400);
            }
            
            // Create a new product
            const newProduct = new Product({...value});
            await newProduct.save();

            // remove password from the response
            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    },

    patch: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const {id} = req.body;
            if (!id) {
                throw new AppError('ProductId is required!', 400);
            }

            const existingProduct = await Product.findOne({
                where: {
                    id: Number(id)
                },
                paranoid: true
            });

            if(!existingProduct || !existingProduct.id) {
                throw new AppError("Product not found", 400);
            }

            // modify products
            existingProduct.name = req.body.name ? req.body.name : existingProduct.name;
            existingProduct.desc = req.body.desc ? req.body.desc : existingProduct.desc;
            existingProduct.price = req.body.price ? req.body.price : existingProduct.price;
             
            await existingProduct.save();

            // remove password from the response
            res.status(200).json(existingProduct);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const {id} = req.query;
            if (!id) {
                throw new AppError('ProductId is required!', 400);
            }

            const existingProduct = await Product.findOne({
                where: {
                    id: Number(id)
                },
                paranoid: false
            });

            if(!existingProduct || !existingProduct.id) {
                throw new AppError("Product not found", 400);
            }

            if(existingProduct && existingProduct.deletedAt) {
                throw new AppError("Product already deleted", 400);
            }

            await existingProduct.destroy();

            // remove password from the response
            res.status(200).json('Product deleted successfully!');
        } catch (error) {
            next(error);
        }
    },

    restore: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const {id} = req.query;
            if (!id) {
                throw new AppError('ProductId is required!', 400);
            }

            const existingProduct = await Product.findOne({
                where: {
                    id: Number(id)
                },
                paranoid: false
            });

            if(!existingProduct || !existingProduct.id) {
                throw new AppError("Product not found", 400);
            }

            if(existingProduct && !existingProduct.deletedAt) {
                throw new AppError("Product already available", 400);
            }

            existingProduct.deletedAt = null;
            await existingProduct.save()

            // remove password from the response
            res.status(200).json('Product restored successfully!');
        } catch (error) {
            next(error);
        }
    },

    // login: async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         // Validate the request body against the login schema
    //         const { error, value } = loginSchema.validate(req.body);
    //         if (error) {
    //             throw new AppError(error.details[0].message, 400);
    //         }
            
    //         const { email, password } = value;

    //         // Find the user by email
    //         const user = await User.findOne({ 
    //             where: {
    //                 email
    //             }        
    //         });
    //         if (!user) {
    //             throw new AppError("Invalid email", 401);
    //         }

    //         // Compare the hashed password
    //         const isMatch = await bcrypt.compare(password, user.password);
    //         if (!isMatch) {
    //             throw new AppError("Invalid email or password", 401);
    //         }

    //         // Generate an access token
    //         if (!jwtConfig.secret) {
    //             throw new AppError("JWT secret is not defined", 500);
    //         }

    //         const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, { expiresIn: '1h' });
    //         res.status(200).json({ token });
    //     } catch (error) {
    //         next(error);
    //     }
    // },
}

export default productHandlers;