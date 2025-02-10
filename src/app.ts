import express from 'express';
import sequelize from './db/connect';
import errorHandling from './middlewares/errorHandling';
import AppError from './utils/AppError';
import errorHandler from './utils/ErrorHandler';


const app = express();

app.use(express.json());

//middlewares

import userRoutes from './routes/userRoutes';
// routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    console.log(req.headers);
    res.send('Hello World!');
});

// handle errors and responds with json
app.use(errorHandling);

// unhandled exception
process.on('unhandledRejection', (error: Error) => {
    const apperror = new AppError(error.message, 500, false);
    errorHandler(apperror);
});

app.listen(3000, async () => {
    try {
        console.log('Server is running on http://localhost:3000');
        await sequelize.sync();
        console.log('Database connected!');
    } catch (error) { 
        console.error('Unable to connect to the database:', error);
    }
});