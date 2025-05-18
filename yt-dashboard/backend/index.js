
import express from 'express';
import dotenv from 'dotenv';
import router  from './Routes/ApiRoutes.js';
import cors from 'cors';

const app = express();
dotenv.config();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
    methods : ['POST','PUT','GET','DELETE']
}));

app.use(express.json());

app.use('/api/v1',router);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on  ${process.env.PORT}`)
})