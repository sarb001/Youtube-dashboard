
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import router  from './Routes/ApiRoutes.js';
import cors from 'cors';


const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' ? process?.env?.FRONTEND_PROD_URL : 'http://localhost:5173'

app.use(cors({
    origin : allowedOrigins,
    credentials : true,
    methods : ['POST','PUT','GET','DELETE']
}));

app.use(express.json());

app.use('/api/v1',router);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on  ${process.env.PORT}`)
})