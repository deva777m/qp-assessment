import { Request, Response, NextFunction } from 'express';
import {Op} from "sequelize"
import Joi from 'joi';
import Product from '../db/models/Product';
import AppError from '../utils/AppError';
import Inventory from '../db/models/Inventory';


// Define schema for the user
const inventorySchema = Joi.object({
    product_id: Joi.number().required(), 
    quantity: Joi.number().min(0).required(),
});

const inventoryHandlers = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the all products
            const products = await Inventory.findAll({
                where: {
                    quantity: {[Op.gt] : 0}
                },
                include: Product
            });
            
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if(!id) { 
                throw new AppError("ItemId is required!", 400);
            }
            // Get the all products
            const product = await Inventory.findOne({
                where: {
                    id: Number(id)
                },
                include: Product
            });
            
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    },

    post: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const {product_id, quantity} = req.body;
            const productValues = {product_id, quantity};
            const { error, value } = inventorySchema.validate(productValues);
            if (error) {
                throw new AppError(error.details[0].message, 400);
            }

            const existingItem = await Inventory.findOne({
                where: {
                    product_id: value.product_id
                },
                include: Product
            });

            if(existingItem && existingItem.id) {
                throw new AppError("Item already added!", 400);
            }
            
            // Create a new Item
            const newItem = new Inventory({...value});
            await newItem.save();

            // remove password from the response
            res.status(201).json(newItem);
        } catch (error) {
            next(error);
        }
    },

    patch: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const {id} = req.body;
            if (!id) {
                throw new AppError('ItemId is required!', 400);
            }

            const existingItem = await Inventory.findOne({
                where: {
                    id: Number(id)
                },
                include: Product
            });

            if(!existingItem || !existingItem.id) {
                throw new AppError("Product not found", 400);
            }

            // modify quantity
            existingItem.quantity = req.body.quantity ? req.body.quantity : existingItem.quantity;
            await existingItem.save();

            // remove password from the response
            res.status(200).json(existingItem);
        } catch (error) {
            next(error);
        }
    },
}

export default inventoryHandlers;