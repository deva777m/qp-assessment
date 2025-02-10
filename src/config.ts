import dotenv from 'dotenv';
dotenv.config({path: 'src/.env'});

export const dbConfig = {
    env: process.env.NODE_ENV,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

export const jwtConfig = {
    secret: process.env.JWT_SECRET
};