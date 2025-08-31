import express  from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/connectDB.js';


import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT|| 8000;

await connectDB();

app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


app.use("/api/v1/user", userRoutes);

app.listen(() => {
    console.log(`Server is running on post: ${PORT}`);
});