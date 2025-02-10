import { Optional } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import User from "./User";
import OrderItem from "./OrderItem";


interface OrderAttributes {
    id: number;
    user_id: number;
    status: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

@Table({
    tableName: "orders",
    timestamps: true,
    modelName: "Order",
})

export default class Order extends Model<OrderAttributes, OrderCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare user_id: number;

    @BelongsTo(() => User, {onDelete: "CASCADE"})
    declare user: User;

    @HasMany(() => OrderItem)
    declare items: OrderItem[];

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare status: string;
    
    @CreatedAt
    declare createdAt: Date;
}