import { Optional } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Order from "./Order";
import Product from "./Product";

interface OrderItemAttributes {
    id: number;
    product_id: number;
    order_id: number;
    quantity: number;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id"> {}

@Table({
    tableName: "order_items",
    timestamps: true,
    modelName: "OrderItem",
})

export default class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare order_id: number;

    @BelongsTo(() => Order, {onDelete: "CASCADE"})
    declare order: Order;

    
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare product_id: number;

    @BelongsTo(() => Product, {onDelete: "NO ACTION"})
    declare product: Product;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare quantity: number;

    @UpdatedAt
    declare updatedAt: Date;
}