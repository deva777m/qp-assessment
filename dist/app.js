"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import dotenv from 'dotenv';
const app = (0, express_1.default)();
app.use(express_1.default.json());
// load environment variables
// dotenv.config({path: 'src/.env'});
// connect to database
// import connectDB from './config/db';
// connectDB();
// import user module
//middlewares
// routes
app.get('/', (req, res) => {
    console.log(req.headers);
    res.send('Hello World!');
});
// handle errors and responds with json
// app.use(errorHandling);
// unhandled exception
// process.on('unhandledRejection', (error: Error) => {
//     const apperror = new AppError(error.message, 500, false);
//     errorHandler(apperror);
// });
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
