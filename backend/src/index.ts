import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import pg from "pg";
import type { QueryResult } from "pg";
import multer from "multer";
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
const salt_rounds = 10; // bcrypt number of salt rounds when hashing passwords

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
  'https://portfolio-lyonsxiis-projects.vercel.app', // Change to deployed URL when deployed online!!
  'http://localhost:5173',
];

// Multer, user uploading file storage config
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024}
});

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

// Login to account
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

// Match closest x characters from database based on string
app.get("/characters/search", async (req, res) => {
  const { text, num } = req.query;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const search = await db.query(
      `SELECT char_id, name, description, image,
         similarity(name, $1) AS score
       FROM characters
       WHERE name ILIKE $1
       ORDER BY score DESC
       LIMIT $2;`,
      [`%${text}%`, num]
    );

    const result = search.rows.map(row => ({
      charId: row.char_id,
      name: row.name,
      description: row.description,
      image: row.image
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Match closest x properties from database based on string
app.get("/properties/search", async (req, res) => {
  const { text, num } = req.query;
  console.log(text);

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const search = await db.query(
      `SELECT property_id, name,
         similarity(name, $1) AS score
       FROM properties
       WHERE name ILIKE $1
       ORDER BY score DESC
       LIMIT $2;`,
      [`%${text}%`, num]
    );

    const result = search.rows.map(row => ({
      propertyId: row.property_id,
      name: row.name
    }));

    console.log(result);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all tag names (and matching tag categories)
app.get("/tags", async (req, res) => {
  try {
    const search = await db.query(
      `SELECT t.tag_id AS tag_id, t.tag AS tag, c.name AS category
       FROM tags t
       INNER JOIN categories c ON t.category_id = c.category_id
       ORDER BY category, tag ASC;`,
      []
    );

    const result = search.rows.map(row => ({
      tagId: row.tag_id,
      tag: row.tag,
      category: row.category
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get character names and images (10 at a time)
app.get("/characters", async (req, res) => {
  const { charId, propertyId, tagFilters, lastId } = req.query;

  try {
    let query = `SELECT DISTINCT c.char_id, c.name, c.image
       FROM characters c
       INNER JOIN property_tags pt ON c.property_id = pt.property_id`

    const conditions: string[] = [];
    const params: any[] = [];

    if (charId != undefined) {
      params.push(charId);
      conditions.push(`char_id = $${params.length}`);
    }

    if (propertyId != undefined) {
      params.push(propertyId);
      conditions.push(`c.property_id = $${params.length}`);
    }

    // Convert string back into array
    if (tagFilters != undefined) {
      const tagArray = Array.isArray(tagFilters)
        ? tagFilters.map(Number)
        : String(tagFilters).split(",").map(Number);

        params.push(tagArray);
        conditions.push(`tag_id = ANY($${params.length})`);
      }

    if (lastId != undefined) {
      params.push(lastId);
      conditions.push(`char_id > $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    if (tagFilters != null) {
      const tagArray = Array.isArray(tagFilters)
        ? tagFilters.map(Number)
        : String(tagFilters).split(",").map(Number);

      query += ` GROUP BY c.char_id, c.name, c.image
        HAVING COUNT(DISTINCT tag_id) = ${tagArray.length}`
      }

    query += `
      ORDER BY char_id ASC
      LIMIT 10;
    `;

    const search = await db.query(query, params);

    const result = search.rows.map(row => ({
      charId: row.char_id,
      name: row.name,
      image: row.image,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a post
app.post("/createPost", upload.single("attachment"), async (req, res) => {
  const { charId, postData, lenRawText } = req.body;
  const attachmentName = req.file?.filename ?? null;
  const owner_id = 1;

  // Bad inputs
  if (charId === null || lenRawText === 0) return res.status(400).json({ error: "Missing character or text"});
  if (lenRawText > 280) return res.status(400).json({ error: "Too many characters"});
  if (postData.length > 5000) return res.status(400).json({ error: "Input too large"});

  try {
    const result = await db.query(
      "INSERT INTO posts (owner_id, character_id, content, attachment) VALUES ($1, $2, $3, $4) RETURNING post_id", 
      [owner_id, charId, postData, attachmentName]);

    res.status(201).json({ user: result.rows[0].post_id });
  } catch(err: any) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a post
app.get("/post", async (req, res) => {
  const { postId } = req.query;

  try {
    const search = await db.query(
      `SELECT name, image, content, replies, emojis, likes, dislikes, p.created_at, updated_at
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
      emojis: row.emojis,
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

// React to a post
  // Either add reaction, update reaction from opposite, or undo previous reaction
app.post("/react", async (req, res) => {
  const { postId, reactionType, reactionValue } = req.body;
  const userId = 1;

  type ReactionType = "like" | "dislike" | "favourite" | "emoji";
  // Mapping reactionType to oppose (e.g. like -> dislike)
  const oppositeReaction: Record<ReactionType, string | null> = {
    like: "dislike",
    dislike: "like",
    favourite: null,
    emoji: null,
  };

  // Mappping reactionType to posts columns (e.g. like -> likes column)
  const reactionColumns: Record<string, string | null> = {
    like: "likes",
    dislike: "dislikes",
    emoji: "emojis"
  };
  const column = reactionColumns[reactionType];

  try {
    await db.query("BEGIN");

    // Selecting all reactions for post by user
    const check = await db.query(
      `SELECT reaction, reaction_value
       FROM post_reactions
       WHERE post_id = $1 AND user_id = $2;`,
      [postId, userId]
    );
    const reactions = new Set(check.rows.map(r => r.reaction));

    // Reaction type isn't allowed (not 'like', 'dislike', 'love', 'favourite' or 'emoji')
    if (!(reactionType in oppositeReaction)) {
      return res.status(400).json({ error: "Invalid reactionType" });
    }

    let result = null;

    const opposite = oppositeReaction[reactionType as ReactionType];
    // User has already reacted to post
    if (reactions.has(reactionType)) {
      // Delete reaction
      result = await db.query(
        `DELETE FROM post_reactions
        WHERE post_id = $1 AND user_id = $2 AND reaction = $3`,
        [postId, userId, reactionType]
      )

      // Decrement count for like, dislike, and emoji
      if (column) {
        await db.query(
          `UPDATE posts
          SET ${column} = ${column} - 1
          WHERE post_id = $1`,
          [postId]
        );
      }
          
    // User currently has opposite reaction to post (i.e. has disliked and now wants to like)
    } else if (opposite && reactions.has(opposite)) {
      // Update reaction and adjust counts
      result = await db.query(
        `UPDATE post_reactions
        SET reaction = $1
        WHERE post_id = $2 AND user_id = $3 AND reaction = $4`,
        [reactionType, postId, userId, oppositeReaction[reactionType as ReactionType]]
      )

      const negReaction = oppositeReaction[reactionType as ReactionType];
      const oppositeColumn =
        negReaction && negReaction in reactionColumns
          ? reactionColumns[negReaction as keyof typeof reactionColumns]
          : null;
      await db.query(
        `UPDATE posts
        SET ${column} = ${column} + 1,
            ${oppositeColumn} = ${oppositeColumn} - 1
        WHERE post_id = $1`,
        [postId]
      );

    } else {
      // No relevant previous reaction, add into table and increment count
      result = await db.query(
        `INSERT INTO post_reactions (post_id, user_id, reaction, reaction_value)
        VALUES ($1, $2, $3, $4)`,
        [postId, userId, reactionType, reactionValue]
      );

      if (column) {
        await db.query(
          `UPDATE posts
          SET ${column} = ${column} + 1
          WHERE post_id = $1`,
          [postId]
        );
      }
    }

    await db.query("COMMIT");

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve multiple posts for feed (filtering based on character and property)
// Retrieve multiple posts for feed (filtering based on character and property)
app.get("/feed", async (req, res) => {
  const { charId, propertyId, lastId } = req.query;
  const userId = 1;

  let search: QueryResult<any>;
  try {
    let query = 
    `SELECT 
      p.post_id, 
      c.name, 
      c.image, 
      p.content, 
      p.replies, 
      p.emojis, 
      p.likes, 
      p.dislikes, 
      p.created_at, 
      p.updated_at, 
      p.attachment,

      EXISTS (
        SELECT 1
        FROM post_reactions pr
        WHERE pr.post_id = p.post_id
          AND pr.user_id = $1
          AND pr.reaction = 'like'
      ) AS "isLiked",
      EXISTS (
        SELECT 1
        FROM post_reactions pr
        WHERE pr.post_id = p.post_id
          AND pr.user_id = $1
          AND pr.reaction = 'dislike'
      ) AS "isDisliked",
      EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reaction = 'favourite'
      ) AS "isFavourited",
      EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reaction = 'emoji'
      ) AS "isEmojied"
       
      FROM posts p
      INNER JOIN characters c ON p.character_id = c.char_id`

    const conditions: string[] = [];
    const params: any[] = [userId];

    if (charId != null) {
      params.push(charId);
      conditions.push(`p.character_id = $${params.length}`);
    }

    if (propertyId != null) {
      params.push(propertyId);
      conditions.push(`c.property_id = $${params.length}`);
    }

    if (lastId != null) {
      params.push(lastId);
      conditions.push(`p.post_id < $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += `
      ORDER BY p.created_at DESC, p.post_id DESC
      LIMIT 10;
    `;

    search = await db.query(query, params);

    const result = search.rows.map(row => ({
      postId: row.post_id,
      name: row.name,
      image: row.image,
      content: row.content,
      replies: row.replies,
      emojis: row.emojis,
      likes: row.likes,
      dislikes: row.dislikes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      attachment: row.attachment ? "uploads/" + row.attachment : undefined,
      isLiked: row.isLiked,
      isDisliked: row.isDisliked,
      isFavourited: row.isFavourited,
      isEmojied: row.isEmojied
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});