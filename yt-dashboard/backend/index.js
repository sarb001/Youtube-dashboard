
import express from 'express';
import dotenv from 'dotenv';
import router  from './Routes/ApiRoutes.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/v1',router);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on  ${process.env.PORT}`)
})