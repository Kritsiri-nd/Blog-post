import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js';

dotenv.config();

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
    res.send("Hello TechUp!");
});

app.get("/profile", (req, res) => {
    res.status(200).json({
        "data": {
            "name": "john",
            "age": 20
        }
    });
});

// Use posts router
app.use("/posts", postsRouter);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
