import express  from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT|| 8000;

await connectDB();

app.listen(() => {
    console.log(`Server is running on post: ${PORT}`);
});