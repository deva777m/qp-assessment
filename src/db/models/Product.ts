import { Optional } from "sequelize";
import Inventory from "./Inventory";
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasOne,
} from "sequelize-typescript";

interface ProductAttributes {
    id: number;
    name: string;
    desc: string;
    price: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

@Table({
    tableName: "products",
    timestamps: true,
    modelName: "Product",
    paranoid: true,
})

export default class Product extends Model<ProductAttributes, ProductCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare desc: string;

    @Column({
        type: DataType.DECIMAL,
        defaultValue: 0,
        allowNull: false
    })
    declare price: number;

    @HasOne(() => Inventory)
    declare inventory: Inventory;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}