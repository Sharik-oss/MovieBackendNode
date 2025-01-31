import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Movie } from "./movie.entity";
import cors from "cors";

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
const port = process.env.PORT || 1043;
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/movie", async (req: Request, res: Response) => {
  try {
    const movies = await myDataSource.getRepository(Movie).find();
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/movie/:id", async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);
    const movie = await myDataSource.getRepository(Movie).findOneBy({
      id: movieId,
    });

    res.send(movie);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/movie/add", async (req: Request, res: Response) => {
  try {
    console.log("Received data:", req.body);

    // Ensure the genre is stored as a JSON string
    const newMovie = myDataSource.getRepository(Movie).create({
      ...req.body,
      genre: Array.isArray(req.body.genre)
        ? req.body.genre.join(", ")
        : req.body.genre,
    });

    const savedMovie = await myDataSource.getRepository(Movie).save(newMovie);

    res
      .status(201)
      .json({ message: "Movie added successfully!", movie: savedMovie });
  } catch (error) {
    console.error("Error saving movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/movie/delete/:id", async (req, res) => {
  const movieId = req.params.id;
  const movies = await myDataSource.getRepository(Movie).delete(movieId);
  res.status(200).send("Deleted");
});

app.patch("/movie/update/:id", async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);
    const updateData = req.body;
    await myDataSource.getRepository(Movie).update(movieId, updateData);
    res.status(200).json({ message: "Movie updated successfully!" });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(400).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
