import { Optional } from "sequelize";
import Inventory from "./Inventory";
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
    HasOne,
} from "sequelize-typescript";

interface ProductAttributes {
    id: number;
    name: string;
    desc: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

@Table({
    tableName: "products",
    timestamps: true,
    modelName: "Product",
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

    @HasOne(() => Inventory)
    declare inventory: Inventory;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}