import { Optional } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";

interface UserAttributes {
    id: number;
    email: string;
    role: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
    tableName: "users",
    timestamps: true,
    modelName: "User",
})

export default class User extends Model<UserAttributes, UserCreationAttributes> {
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
    declare email: string;

    @Column({
        type: DataType.STRING,
        defaultValue: "user",
        allowNull: false,
    })
    declare role: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}