import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Product from '../db/models/Product';
import AppError from '../utils/AppError';
import Inventory from '../db/models/Inventory';
import Order from '../db/models/Order';
import OrderItem from '../db/models/OrderItem';
import User from '../db/models/User';
import sequelize from '../db/connect';
import { Op } from 'sequelize';


interface IOrderItem {
    item_id: number;
    quantity: number;
}

const orderItemSchema = Joi.object({
    item_id: Joi.number().required(), 
    quantity: Joi.number().min(1).required(),
});

// Define schema for the user
const orderSchema = Joi.object({
    user_id: Joi.number().required(),
    items: Joi.array().items(orderItemSchema).min(1).required(),
});

const orderHandlers = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the all orders
            const orders = await Order.findAll({
                include: [
                    {model: User, where: {id: req.body.userId}, attributes: ['email']},
                    { model: OrderItem,
                        include: [{ model: Product, attributes: ['name', 'price'], paranoid: false}]
                    }]
            });
            
            res.status(200).json(orders);
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
            // Get the order
            const order = await Order.findOne({
                where: {
                    id: Number(id)
                },
                include: [
                    {model: User, where: {id: req.body.userId}, attributes: ['email']},
                    { model: OrderItem,
                    include: [{ model: Product, attributes: ['name', 'price'], paranoid: false}] }]
            });
            
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },

    post: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const {userId, items} = req.body;
            const orderValues = {user_id: userId, items};
            const { error, value } = orderSchema.validate(orderValues);
            if (error) {
                throw new AppError(error.details[0].message, 400);
            }

            // collect order item ids
            const itemIds = items.map((item: IOrderItem) => item.item_id);
            
            // Create a new Order
            const newOrder = new Order({user_id: value.user_id, status: 'pending', total: 0});

            // run transaction
            await sequelize.transaction(async (t) => {
                try {
                    // save pending order
                    await newOrder.save({transaction: t});

                    // lock items
                    const inventoryItems = await Inventory.findAll({
                        where: {
                            id: itemIds,
                            quantity: {[Op.gt] : 0},
                        },
                        lock: t.LOCK.UPDATE,
                        transaction: t
                    });

                    // items with product details
                    const itemsPrices = await Inventory.findAll({
                        where: {
                            id: itemIds,
                            quantity: {[Op.gt] : 0},
                        },
                        include: [{model: Product, attributes: ['price']}],
                        transaction: t
                    });

                    let enoughItems = true;
                    if(inventoryItems.length !== itemIds.length) {
                        throw new AppError("Some items are not available!", 400);
                    }
                    
                    let total = 0;
                    const orderItems:any = [];
                    inventoryItems.forEach(item => {
                        const requiredQuantity = items.find((i: IOrderItem) => i.item_id === item.id)?.quantity;
                        if(item.quantity < requiredQuantity) {
                            enoughItems = false;
                            return;
                        }
                        orderItems.push(
                            {
                                order_id: newOrder.id,
                                product_id: item.product_id,
                                quantity: requiredQuantity
                            }
                        );
                        item.quantity -= requiredQuantity;
                    });

                    // update total
                    itemsPrices.forEach(item => {
                        if(!item.product) throw new AppError("Some items are not available!", 400);
                        const requiredQuantity = items.find((i: IOrderItem) => i.item_id === item.id)?.quantity;
                        total += (item ? item.product.price : 0)*(requiredQuantity);
                    });
                      

                    if(!enoughItems) {
                        throw new AppError("Some items are not available!", 400);
                    }
                    // bulk update inventory items
                    await Promise.all(inventoryItems.map(item => item.save({transaction: t})));

                    // bulk save order items
                    await OrderItem.bulkCreate(orderItems, {transaction: t});

                    console.log("total: ", total);
                    await newOrder.update({status: 'completed', total : total}, {transaction: t});
                } catch (error) {
                    if (error instanceof Error && error.name === 'SequelizeLockError') {
                        throw new AppError("Some items are not available!", 400);
                    } else {
                        throw error;
                    }
                }
            });
            res.status(201).json(newOrder);
        } catch (error) {
            next(error);
        }
    },
}

export default orderHandlers;