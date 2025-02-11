import { Optional } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Product from "./Product";

interface InventoryAttributes {
    id: number;
    product_id: number;
    quantity: number;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id"> {}

@Table({
    tableName: "inventory",
    timestamps: true,
    modelName: "Inventory",
})

export default class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare product_id: number;

    @BelongsTo(() => Product, {onDelete: "CASCADE"})
    declare product: Product;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare quantity: number;
    
    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}