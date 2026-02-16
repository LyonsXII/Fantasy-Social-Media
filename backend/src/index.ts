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

app.get("/", (req, res) => {
  console.log("hey");
  res.send("Hello from Express backend!");
});

// Register a new account
app.post("/register", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ error: "Missing login or password"})

  try {
    const hashedPassword = await bcrypt.hash(password, salt_rounds);
    const result = await db.query(
      "INSERT INTO user_accounts (login, password_hash) VALUES ($1, $2) RETURNING user_id, login", 
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
      "SELECT user_id, login, password_hash FROM user_accounts WHERE login = $1",
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});