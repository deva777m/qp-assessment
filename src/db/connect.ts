import { Sequelize } from "sequelize-typescript";
import {dbConfig} from "../config";

const sequelize = new Sequelize({
    database: dbConfig.database,
    host: dbConfig.host,
    port: Number(dbConfig.port),
    username: dbConfig.user,
    password: dbConfig.password,    
    dialect: "postgres",
    models: [__dirname + "/models"],
});

export default sequelize;