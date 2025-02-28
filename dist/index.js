"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const movie_entity_1 = require("./movie.entity");
const cors_1 = __importDefault(require("cors"));
const ad_entity_1 = require("./ad.entity");
dotenv_1.default.config();
exports.myDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123456",
    database: "MovieWebsite",
    entities: [movie_entity_1.Movie, ad_entity_1.Ad],
    logging: false,
    synchronize: true,
});
exports.myDataSource
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 1043;
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/movie", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield exports.myDataSource.getRepository(movie_entity_1.Movie).find();
        res.status(200).json(movies);
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/movie/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.id);
        const movie = yield exports.myDataSource.getRepository(movie_entity_1.Movie).findOneBy({
            id: movieId,
        });
        res.send(movie);
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/movie/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received data:", req.body);
        // Ensure the genre is stored as a JSON string
        const newMovie = exports.myDataSource.getRepository(movie_entity_1.Movie).create(Object.assign(Object.assign({}, req.body), { genre: Array.isArray(req.body.genre)
                ? req.body.genre.join(", ")
                : req.body.genre }));
        const savedMovie = yield exports.myDataSource.getRepository(movie_entity_1.Movie).save(newMovie);
        res
            .status(201)
            .json({ message: "Movie added successfully!", movie: savedMovie });
    }
    catch (error) {
        console.error("Error saving movie:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.delete("/movie/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movieId = req.params.id;
    const movies = yield exports.myDataSource.getRepository(movie_entity_1.Movie).delete(movieId);
    res.status(200).send("Deleted");
}));
app.patch("/movie/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.id);
        const updateData = req.body;
        yield exports.myDataSource.getRepository(movie_entity_1.Movie).update(movieId, updateData);
        res.status(200).json({ message: "Movie updated successfully!" });
    }
    catch (error) {
        console.error("Error updating movie:", error);
        res.status(400).json({ error: "Internal server error" });
    }
}));
app.get("/ad", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ads = yield exports.myDataSource.getRepository(ad_entity_1.Ad).find();
        res.status(200).json(ads);
    }
    catch (error) {
        console.log("Error fetching ads", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/ad/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received data:", req.body);
        // Ensure the genre is stored as a JSON string
        const newMovie = exports.myDataSource.getRepository(ad_entity_1.Ad).create(Object.assign({}, req.body));
        const savedMovie = yield exports.myDataSource.getRepository(ad_entity_1.Ad).save(newMovie);
        res
            .status(201)
            .json({ message: "Movie added successfully!", ad: ad_entity_1.Ad });
    }
    catch (error) {
        console.error("Error saving movie:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.delete("/delete/ad/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adId = req.params.id; // Corrected from req.params.adId
        yield exports.myDataSource.getRepository(ad_entity_1.Ad).delete(adId);
        res.status(200).json({ message: "Ad deleted successfully!" });
    }
    catch (error) {
        console.error("Error deleting ad:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
