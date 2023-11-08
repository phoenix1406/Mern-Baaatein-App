import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";

import User from "./model/User.js";
import Post from "./model/Post.js";
import { users, posts } from "./data/index.js";

/* configuration of middleware */
// when we want to use fileurl in module = type
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// file storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// connecting database
const PORT = process.env.PORT || 6001;

const username = encodeURIComponent("user123");
const password = encodeURIComponent("user@123");

const MONGO_URL = `mongodb+srv://${username}:${password}@atlascluster.udqc5gm.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is working on ${PORT}`);

      //   User.insertMany(users);
      //   Post.insertMany(posts);
    });
  })
  .catch((error) => {
    console.log(`${error} did not work`);
  });

// routes for the models  who uploads with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// routes for the model who uploads without files
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
