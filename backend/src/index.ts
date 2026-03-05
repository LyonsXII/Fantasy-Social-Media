import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import pg from "pg";
import path from "path";
import * as dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


// Settings
const salt_rounds = 10; // bcrypt number of salt rounds when hashing

let db;
// Connect to database
if (process.env.DB_URL) {
  // Production
  db = new pg.Client({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Local database
  db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "fantasy_social_media",
    password: process.env.DB_PASSWORD,
    port: 5432,
  });
}
db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err));

const allowedOrigins = [
  'https://portfolio-lyonsxiis-projects.vercel.app', // Change to deployed URL when deployed online
  'http://localhost:5173',
];

const port = 5000;

app.use(cors({ origin: "*" }));

// Register a new account
app.post("/register", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ error: "Missing login or password"})

  try {
    const hashedPassword = await bcrypt.hash(password, salt_rounds);
    const result = await db.query(
      "INSERT INTO users (login, password_hash) VALUES ($1, $2) RETURNING user_id, login", 
      [login, hashedPassword]);

    res.status(201).json({ user: result.rows[0] });
  } catch(err: any) {
    // Unique violation for login
    if (err.code === "23505") {
      return res.status(400).json({ error: "This username has already been taken" });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async(req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ error: "Please enter a username and password"})

  try {
    const result = await db.query(
      "SELECT user_id, login, password_hash FROM users WHERE login = $1",
      [login]
    );

    // No match for username in database
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "No account found for this username"})
    };

    const user = result.rows[0]
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    // Password invalid, hashes don't match
    if (!passwordValid) {
      return res.status(400).json({ error: "Invalid password"})
    }

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.status(200).json({ id: user.id, login: user.login, token: token })
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/feed", async (req, res) => {

});

app.get("/characters/search", async (req, res) => {
  const { text } = req.query;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const search = await db.query(
      `SELECT char_id, name, image,
         similarity(name, $1) AS score
       FROM characters
       WHERE name ILIKE $1
       ORDER BY score DESC
       LIMIT 5;`,
      [`%${text}%`]
    );

    const result = search.rows.map(row => ({
      charId: row.char_id,
      name: row.name,
      image: row.image
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createPost", async (req, res) => {
  const { charId, postData, lenRawText } = req.body;
  const convPostData = JSON.stringify(postData);
  const owner_id = 1;

  // Bad inputs
  if (charId === null || lenRawText === 0) return res.status(400).json({ error: "Missing character or text"});
  if (lenRawText > 280) return res.status(400).json({ error: "Too many characters"});
  if (convPostData.length > 5000) return res.status(400).json({ error: "Input too large"});

  try {
    const result = await db.query(
      "INSERT INTO posts (owner_id, character_id, content) VALUES ($1, $2, $3) RETURNING post_id", 
      [owner_id, charId, convPostData]);

    res.status(201).json({ user: result.rows[0] });
  } catch(err: any) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/post", async (req, res) => {
  const { postId } = req.query;

  try {
    const search = await db.query(
      `SELECT name, image, content, replies, loves, likes, dislikes, p.created_at, updated_at
       FROM posts p
       INNER JOIN characters c ON p.character_id = c.char_id
       WHERE post_id = $1;`,
      [postId]
    );

    const result = search.rows.map(row => ({
      name: row.name,
      image: row.image,
      content: row.content,
      replies: row.replies,
      loves: row.loves,
      likes: row.likes,
      dislikes: row.dislikes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});