import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Movie } from "./movie.entity";
import cors  from 'cors';


dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "MovieWebsite",
  entities: [Movie],
  logging: false,
  synchronize: true,
});

myDataSource
.initialize()
.then(() => {
    console.log("Data Source has been initialized!");
})
.catch((err) => {
    console.error("Error during Data Source initialization:", err);
});


const app: Express = express();
const port = process.env.PORT || 3000;
app.use(
    cors({
        origin: '*',
        credentials: true,
        methods: ["GET","POST", "PUT", "DELETE"],
        allowedHeaders: "*"
    })
)

app.get("/movie", async (req: Request, res: Response) => {
  try {
    const movies = await myDataSource.getRepository(Movie).find();
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
