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

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/search", async (req, res) => {
  const { text } = req.query;
  const charId =
    typeof req.query.charId === "string"
      ? req.query.charId
      : null;
  const propertyId =
    typeof req.query.propertyId === "string"
      ? req.query.propertyId
      : null;

  console.log(charId, propertyId, text);


  const result = await db.query(
    `SELECT *,
      ts_rank(search_vector, websearch_to_tsquery('english', $1)) AS rank,
      similarity(raw_text, $1) AS sim
    FROM posts
    WHERE
      search_vector @@ websearch_to_tsquery('english', $1)
      OR similarity(raw_text, $1) > 0.2
    ORDER BY
      rank DESC,
      sim DESC
    LIMIT 20;`,
    [text]
  );

  res.json(result);
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
  if (!postData) return res.status(400).json({ error: "Missing content"});
  if (charId === null || lenRawText === 0) return res.status(400).json({ error: "Missing character or text"});
  if (lenRawText > 280) return res.status(400).json({ error: "Too many characters"});
  if (postData.length > 5000) return res.status(400).json({ error: "Input too large"});

  try {
    type LexicalNode = {
      type: string;
      text?: string;
      children?: LexicalNode[];
    };
    
    function extractTextFromLexical(lexicalRawText: string) {
      const lexicalContent = JSON.parse(lexicalRawText);

      if (!lexicalContent?.root) return "";

      const result: string[] = [];

      function traverse(node: LexicalNode) {
        if (!node) return;

        // Text node
        if (node.type === "text" && node.text) {
          result.push(node.text);
        }

        // Traverse children
        if (node.children) {
          node.children.forEach(traverse);
        }

        // Add spacing for block-level nodes
        if (
          node.type === "paragraph" ||
          node.type === "heading" ||
          node.type === "listitem"
        ) {
          result.push(" ");
        }
      }

      traverse(lexicalContent.root);

      return result.join("").replace(/\s+/g, " ").trim();
    }

    const rawText = extractTextFromLexical(postData);

    const result = await db.query(
      `INSERT INTO posts (owner_id, character_id, content, raw_text, attachment) 
      VALUES ($1, $2, $3, $4, $5) RETURNING post_id`, 
      [owner_id, charId, postData, rawText, attachmentName]);

    res.status(201).json({ postId: result.rows[0].post_id });
  } catch(err: any) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a post
app.get("/post", async (req, res) => {
  const { postId } = req.query;
  const owner_id = 1;

  try {
    const search = await db.query(
      `SELECT
        name,
        image,
        content,
        replies,
        emojis,
        likes,
        dislikes,
        p.created_at,
        updated_at,
        ec.emoji_counts,
        pr.reaction_value AS current_emoji_reaction
      FROM posts p
      INNER JOIN characters c ON p.character_id = c.char_id
      LEFT JOIN (
        SELECT
          post_id,
          json_object_agg(reaction_value, count) AS emoji_counts
        FROM (
          SELECT
            post_id,
            reaction_value,
            COUNT(*) AS count
          FROM post_reactions
          WHERE reply_id IS NULL
            AND reaction = 'emoji'
            AND post_id = $2
          GROUP BY post_id, reaction_value
        ) t
        GROUP BY post_id
      ) ec ON ec.post_id = p.post_id
      LEFT JOIN post_reactions pr ON pr.user_id = $1
        AND pr.post_id = p.post_id
        AND pr.reply_id IS NULL
        AND pr.reaction = 'emoji'
      WHERE p.post_id = $2;`,
      [owner_id, postId]
    );

    const row = search.rows[0];

    const result = {
      name: row.name,
      image: row.image,
      content: row.content,
      replies: row.replies,
      emojis: row.emojis,
      likes: row.likes,
      dislikes: row.dislikes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      emojiCounts: Object.entries(row.emoji_counts || {})
        .map(([reaction, count]) => ({
          reaction,
          count: Number(count),
        }))
        .sort((a, b) => b.count - a.count),
      currentEmojiReaction: row.current_emoji_reaction
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
      ec.emoji_counts,
      pr.reaction_value AS current_emoji_reaction,

      EXISTS (
        SELECT 1
        FROM post_reactions pr
        WHERE pr.post_id = p.post_id
          AND pr.user_id = $1
          AND pr.reply_id IS NULL
          AND pr.reaction = 'like'
      ) AS "isLiked",
      EXISTS (
        SELECT 1
        FROM post_reactions pr
        WHERE pr.post_id = p.post_id
          AND pr.user_id = $1
          AND pr.reply_id IS NULL
          AND pr.reaction = 'dislike'
      ) AS "isDisliked",
      EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reply_id IS NULL
            AND pr.reaction = 'favourite'
      ) AS "isFavourited",
      EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reply_id IS NULL
            AND pr.reaction = 'emoji'
      ) AS "isEmojied"
       
    FROM posts p
    INNER JOIN characters c ON p.character_id = c.char_id
    LEFT JOIN (
      SELECT
        post_id,
        json_object_agg(reaction_value, count) AS emoji_counts
      FROM (
        SELECT
          post_id,
          reaction_value,
          COUNT(*) AS count
        FROM post_reactions
        WHERE reply_id IS NULL
          AND reaction = 'emoji'
        GROUP BY post_id, reaction_value
      ) t
      GROUP BY post_id
    ) ec ON ec.post_id = p.post_id
    LEFT JOIN post_reactions pr ON pr.user_id = $1
      AND pr.post_id = p.post_id
      AND pr.reply_id IS NULL
      AND pr.reaction = 'emoji'`

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
      isEmojied: row.isEmojied,
      emojiCounts: Object.entries(row.emoji_counts || {})
        .map(([reaction, count]) => ({
          reaction,
          count: Number(count),
        }))
        .sort((a, b) => b.count - a.count),
      currentEmojiReaction: row.current_emoji_reaction
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve all favourited posts and replies for user
  // Absolute nightmare, do not break this!
app.get("/favourites", async (req, res) => {
  const userId = 1;
  const lastCreated =
    typeof req.query.lastCreated === "string"
      ? req.query.lastCreated
      : null;

  let search: QueryResult<any>;
  try {
    let params: (number | string)[] = [userId]
    if (lastCreated) {
      params.push(lastCreated);
    }

    // Find 10 most recent favourites
    const { rows: favourites } = await db.query(
      `SELECT
        pr.post_id,
        pr.reply_id,
        pr.reaction,
        pr.created_at
      FROM post_reactions pr
      WHERE pr.user_id = $1
        AND pr.reaction = 'favourite'
        ${lastCreated ? `AND pr.created_at < $2` : ``}
      ORDER BY pr.created_at DESC
      LIMIT 10;`, 
      params
    );

    // Separate out posts and replies
    const postIds = [];
    const replyIds = [];
    for (const fav of favourites) {
      if (fav.reply_id) {
        replyIds.push(fav.reply_id);
      }
      postIds.push(fav.post_id);
    }

    // Fetch all replies needed to form chains (from favourited replies found up to source post)
      // !!! Need to review, recursion in SQL is confusing... !!!
    const { rows: replyChains } = await db.query(
      `WITH RECURSIVE emoji_counts AS (
        SELECT
          reply_id,
          json_object_agg(reaction_value, count) AS emoji_counts
        FROM (
          SELECT
            reply_id,
            reaction_value,
            COUNT(*) AS count
          FROM post_reactions
          WHERE reply_id IS NOT NULL
            AND reaction = 'emoji'
          GROUP BY reply_id, reaction_value
        ) t
        GROUP BY reply_id
      ),
      
      reply_chains AS (
      SELECT
        r.reply_id,
        r.parent_reply_id,
        r.post_id,
        c.name,
        c.image,
        r.content,
        r.replies,
        r.emojis,
        r.likes,
        r.dislikes,
        r.created_at,
        r.updated_at,
        r.attachment,
        ec.emoji_counts,
        (
          SELECT reaction_value
          FROM post_reactions pr
          WHERE pr.user_id = $1
            AND pr.reply_id = r.reply_id
            AND pr.reaction = 'emoji'
          ORDER BY pr.created_at DESC
          LIMIT 1
        ) AS current_emoji_reaction,

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.reply_id = r.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'like'
        ) AS "isLiked",
        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.reply_id = r.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'dislike'
        ) AS "isDisliked",
        EXISTS (
            SELECT 1
            FROM post_reactions pr
            WHERE pr.reply_id = r.reply_id
              AND pr.user_id = $1
              AND pr.reaction = 'favourite'
        ) AS "isFavourited",
        EXISTS (
            SELECT 1
            FROM post_reactions pr
            WHERE pr.reply_id = r.reply_id
              AND pr.user_id = $1
              AND pr.reaction = 'emoji'
        ) AS "isEmojied"

      FROM replies r
      INNER JOIN characters c ON r.character_id = c.char_id
      LEFT JOIN emoji_counts ec ON ec.reply_id = r.reply_id
      WHERE r.reply_id = ANY($2)

      UNION ALL

      SELECT
        parent.reply_id,
        parent.parent_reply_id,
        parent.post_id,
        c.name,
        c.image,
        parent.content,
        parent.replies,
        parent.emojis,
        parent.likes,
        parent.dislikes,
        parent.created_at,
        parent.updated_at,
        parent.attachment,
        ec.emoji_counts,
        (
          SELECT reaction_value
          FROM post_reactions pr
          WHERE pr.user_id = $1
            AND pr.reply_id = parent.reply_id
            AND pr.reaction = 'emoji'
          ORDER BY pr.created_at DESC
          LIMIT 1
        ) AS current_emoji_reaction,

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.reply_id = parent.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'like'
        ) AS "isLiked",
        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.reply_id = parent.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'dislike'
        ) AS "isDisliked",
        EXISTS (
            SELECT 1
            FROM post_reactions pr
            WHERE pr.reply_id = parent.reply_id
              AND pr.user_id = $1
              AND pr.reaction = 'favourite'
        ) AS "isFavourited",
        EXISTS (
            SELECT 1
            FROM post_reactions pr
            WHERE pr.reply_id = parent.reply_id
              AND pr.user_id = $1
              AND pr.reaction = 'emoji'
        ) AS "isEmojied"

      FROM replies parent
      JOIN reply_chains rc
        ON rc.parent_reply_id = parent.reply_id
      INNER JOIN characters c ON parent.character_id = c.char_id
      LEFT JOIN emoji_counts ec ON ec.reply_id = parent.reply_id
      )

      SELECT * FROM reply_chains;`,
      [userId, replyIds]);

    // Final output of posts 
    const { rows: result } = await db.query(
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
        ec.emoji_counts,

        -- latest reaction timestamp (for sorting)
        (
          SELECT MAX(pr.created_at)
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.reply_id IS NULL
        ) AS last_reaction_at,

        -- current user emoji
        (
          SELECT reaction_value
          FROM post_reactions pr
          WHERE pr.user_id = $1
            AND pr.post_id = p.post_id
            AND pr.reply_id IS NULL
            AND pr.reaction = 'emoji'
          ORDER BY pr.created_at DESC
          LIMIT 1
        ) AS current_emoji_reaction,

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reply_id IS NULL
            AND pr.reaction = 'like'
        ) AS "isLiked",

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reply_id IS NULL
            AND pr.reaction = 'dislike'
        ) AS "isDisliked",

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reply_id IS NULL
            AND pr.reaction = 'favourite'
        ) AS "isFavourited",

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.post_id = p.post_id
            AND pr.user_id = $1
            AND pr.reply_id IS NULL
            AND pr.reaction = 'emoji'
        ) AS "isEmojied"

      FROM posts p
      INNER JOIN characters c ON p.character_id = c.char_id

      LEFT JOIN (
        SELECT
          post_id,
          json_object_agg(reaction_value, count) AS emoji_counts
        FROM (
          SELECT
            post_id,
            reaction_value,
            COUNT(*) AS count
          FROM post_reactions
          WHERE reply_id IS NULL
            AND reaction = 'emoji'
          GROUP BY post_id, reaction_value
        ) t
        GROUP BY post_id
      ) ec ON ec.post_id = p.post_id

      WHERE p.post_id = ANY($2)

      ORDER BY last_reaction_at DESC NULLS LAST;`,
      [userId, postIds]
    );
    const resultIndexMap: Record<number, number> = {};
    result.forEach((post, index) => {
      resultIndexMap[post.post_id] = index;
    })

    // Reply chains embedded as new array entry {..., replies: [..., replies: []]}
    function buildChains(replies: any[]) {
      const result: any[] = [];
      const repliesMap: Record<number, any> = {};

      for (const reply of replies) {
        // Ensure reply has a replyChain array
        reply.replyChain = [];

        // Store reference immediately
        repliesMap[reply.reply_id] = reply;

        if (reply.parent_reply_id) {
          const parent = repliesMap[reply.parent_reply_id];

          if (!parent) {
            console.log("hey");
            continue; // parent not found
          }

          parent.replyChain.push(reply);
        } else {
          result.push(reply);
        }
      }

      return result;
    }
    replyChains.sort((a, b) => a.reply_id - b.reply_id);
    const chains = buildChains(replyChains);
    
    chains.forEach((chain) => {
      const mapping = resultIndexMap[chain.post_id];

      if (mapping === undefined || !result[mapping]) return; // guard

      // Ensure replyChain is an array
      result[mapping].replyChain = result[mapping].replyChain || [];
      result[mapping].replyChain.push(chain);
    });

    type EmojiKey = "aghast" | "angry" | "astonished" | "bandage" | "bored" | "clown" | "crying" | "dizzy" | "downcast" | "explode" | "heartEyes" | "heavyCrying" | "laughing" | "puppyEyes" | "sad" | "shocked" | "skeptical" | "sleeping" | "sleeping" | "smile" | "wink" | "worried" | "zipper";

    type EmojiEntry = {
      reaction: EmojiKey;
      count: number;
    };

    type ReplyType = {
      replyId: number;
      parentReplyId?: number;
      postId: number;
      ownerId?: number;
      name: string;
      image: string;
      content: string;
      replies: number;
      emojis: number;
      likes: number;
      dislikes: number;
      createdAt: string;
      updatedAt: string;
      attachment?: string;
      isLiked: boolean;
      isDisliked: boolean;
      isFavourited: boolean;
      isEmojied: boolean;
      replyChain?: ReplyType[];
      emojiCounts: EmojiEntry[];
      currentEmojiReaction: string;
    }

    type PostType = {
      postId: number;
      name: string;
      image: string;
      content: string;
      replies: number;
      emojis: number;
      likes: number;
      dislikes: number;
      createdAt: string;
      updatedAt: string;
      attachment?: string;
      isLiked: boolean;
      isDisliked: boolean;
      isFavourited: boolean;
      isEmojied: boolean;
      replyChain?: ReplyType[];
      emojiCounts: EmojiEntry[];
      currentEmojiReaction: string;
    }

    function mapReply(node: any): ReplyType {
      return {
        replyId: node.reply_id,
        parentReplyId: node.parent_reply_id,
        postId: node.post_id,
        name: node.name,
        image: node.image,
        content: node.content,
        replies: node.replies,
        emojis: node.emojis,
        likes: node.likes,
        dislikes: node.dislikes,
        createdAt: node.created_at,
        updatedAt: node.updated_at,
        attachment: node.attachment ? "uploads/" + node.attachment : undefined,
        isLiked: node.isLiked,
        isDisliked: node.isDisliked,
        isFavourited: node.isFavourited,
        isEmojied: node.isEmojied,
        emojiCounts: node.emoji_counts
          ? (Object.entries(node.emoji_counts) as [EmojiKey, number][])
              .map(([reaction, count]) => ({
                reaction,
                count: Number(count),
              }))
              .sort((a, b) => b.count - a.count)
          : [],
        currentEmojiReaction: node.current_emoji_reaction,
        replyChain: node.replyChain?.length
          ? node.replyChain.map(mapReply)
          : undefined,
      };
    }

    function mapPost(post: any): PostType {
      return {
        postId: post.post_id,
        name: post.name,
        image: post.image,
        content: post.content,
        replies: post.replies,
        emojis: post.emojis,
        likes: post.likes,
        dislikes: post.dislikes,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        attachment: post.attachment ? "uploads/" + post.attachment : undefined,
        isLiked: post.isLiked,
        isDisliked: post.isDisliked,
        isFavourited: post.isFavourited,
        isEmojied: post.isEmojied,
        emojiCounts: post.emoji_counts
          ? (Object.entries(post.emoji_counts) as [EmojiKey, number][])
              .map(([reaction, count]) => ({
                reaction,
                count: Number(count),
              }))
              .sort((a, b) => b.count - a.count)
          : [],
        currentEmojiReaction: post.current_emoji_reaction,
        replyChain: post.replyChain?.length
          ? post.replyChain.map(mapReply)
          : undefined,
      };
    }

    const finalResult: PostType[] = result.map(mapPost);

    res.json(finalResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a reply
app.post("/createReply", upload.single("attachment"), async (req, res) => {
  const { postId, parentReplyId, charId, postData, lenRawText } = req.body;
  const convParentReplyId = parentReplyId != undefined ? parentReplyId : null;
  const attachmentName = req.file?.filename ?? null;
  const owner_id = 1;

  // Bad inputs
  if (!postId && !parentReplyId) return res.status(400).json({ error: "Missing parent to reply to"});
  if (!postData) return res.status(400).json({ error: "Missing content"});
  if (lenRawText > 280) return res.status(400).json({ error: "Too many characters"});
  if (postData.length > 5000) return res.status(400).json({ error: "Input too large"});

  try {
    type LexicalNode = {
      type: string;
      text?: string;
      children?: LexicalNode[];
    };
    
    function extractTextFromLexical(lexicalRawText: string) {
      const lexicalContent = JSON.parse(lexicalRawText);

      if (!lexicalContent?.root) return "";

      const result: string[] = [];

      function traverse(node: LexicalNode) {
        if (!node) return;

        // Text node
        if (node.type === "text" && node.text) {
          result.push(node.text);
        }

        // Traverse children
        if (node.children) {
          node.children.forEach(traverse);
        }

        // Add spacing for block-level nodes
        if (
          node.type === "paragraph" ||
          node.type === "heading" ||
          node.type === "listitem"
        ) {
          result.push(" ");
        }
      }

      traverse(lexicalContent.root);

      return result.join("").replace(/\s+/g, " ").trim();
    }

    const rawText = extractTextFromLexical(postData);

    await db.query("BEGIN");

    const result = await db.query(
      `INSERT INTO replies (owner_id, post_id, parent_reply_id, character_id, content, raw_text, attachment) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING post_id`, 
      [owner_id, postId, convParentReplyId, charId, postData, rawText, attachmentName]);

    // Increment total replies on post
    await db.query(
      `UPDATE posts
      SET replies = replies + 1
      WHERE post_id = $1`, [postId]);

    // Increment parent reply total replies if relevant
    // ToDo: Chain totals up a reply stack? Might be a bit complicated
    if (convParentReplyId) {
      await db.query(
        `UPDATE replies
        SET replies = replies + 1
        WHERE reply_id = $1`, [convParentReplyId]); 
    }

    await db.query("COMMIT");

    res.status(201).json({ replyId: result.rows[0].reply_id });
  } catch(err: any) {
    console.log(err);
    await db.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve a reply
app.get("/reply", async (req, res) => {
  const { replyId } = req.query;
  const userId = 1;

  try {
    const search = await db.query(
      `SELECT 
        c.name, 
        c.image, 
        r.content, 
        r.replies, 
        r.emojis, 
        r.likes, 
        r.dislikes, 
        r.created_at, 
        r.updated_at,
        ec.emoji_counts,
        (
          SELECT reaction_value
          FROM post_reactions pr
          WHERE pr.reply_id = r.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'emoji'
          LIMIT 1
        ) AS current_emoji_reaction

      FROM replies r
      INNER JOIN characters c ON r.character_id = c.char_id
      LEFT JOIN (
        SELECT
          reply_id,
          json_object_agg(reaction_value, count) AS emoji_counts
        FROM (
          SELECT
            reply_id,
            reaction_value,
            COUNT(*) AS count
          FROM post_reactions
          WHERE reaction = 'emoji'
          GROUP BY reply_id, reaction_value
        ) t
        GROUP BY reply_id
      ) ec ON ec.reply_id = r.reply_id
      LEFT JOIN post_reactions pr ON pr.user_id = $1
        AND pr.reply_id = r.reply_id
        AND pr.reaction = 'emoji'
      WHERE r.reply_id = $2;`,
      [userId, replyId]
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
      updatedAt: row.updated_at,
      emojiCounts: Object.entries(row.emoji_counts || {})
        .map(([reaction, count]) => ({
          reaction,
          count: Number(count),
        }))
        .sort((a, b) => b.count - a.count),
      currentEmojiReaction: row.current_emoji_reaction
    }));

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve multiple replies for reply feed
app.get("/replies", async (req, res) => {
  const postId = Number(req.query.postId);
  const parentReplyId = req.query.parentReplyId ? Number(req.query.parentReplyId) : null;
  const lastId = req.query.lastId ? Number(req.query.lastId) : null;
  const userId = 1;

  let search: QueryResult<any>;
  try {
    let query = 
      `SELECT 
        r.reply_id,
        r.post_id,
        r.owner_id,
        c.name,
        c.image,
        r.content,
        r.replies,
        r.emojis,
        r.likes,
        r.dislikes,
        r.created_at,
        r.updated_at,
        r.attachment,
        ec.emoji_counts,
        (
          SELECT reaction_value
          FROM post_reactions pr
          WHERE pr.reply_id = r.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'emoji'
          LIMIT 1
        ) AS current_emoji_reaction,

        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.reply_id = r.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'like'
        ) AS "isLiked",
        EXISTS (
          SELECT 1
          FROM post_reactions pr
          WHERE pr.reply_id = r.reply_id
            AND pr.user_id = $1
            AND pr.reaction = 'dislike'
        ) AS "isDisliked",
        EXISTS (
            SELECT 1
            FROM post_reactions pr
            WHERE pr.reply_id = r.reply_id
              AND pr.user_id = $1
              AND pr.reaction = 'favourite'
        ) AS "isFavourited",
        EXISTS (
            SELECT 1
            FROM post_reactions pr
            WHERE pr.reply_id = r.reply_id
              AND pr.user_id = $1
              AND pr.reaction = 'emoji'
        ) AS "isEmojied"

      FROM replies r
      INNER JOIN characters c ON r.character_id = c.char_id
      LEFT JOIN (
        SELECT
          reply_id,
          json_object_agg(reaction_value, count) AS emoji_counts
        FROM (
          SELECT
            reply_id,
            reaction_value,
            COUNT(*) AS count
          FROM post_reactions
          WHERE reaction = 'emoji'
          GROUP BY reply_id, reaction_value
        ) t
        GROUP BY reply_id
      ) ec ON ec.reply_id = r.reply_id
      WHERE r.post_id = $2`

    const params: any[] = [userId, postId];

    if (parentReplyId != null) {
      params.push(parentReplyId)
      query += ` AND r.parent_reply_id = $${params.length}`;
    } else {
      query += ' AND r.parent_reply_id IS NULL'
    }

    if (lastId !== null) {
      params.push(lastId);
      query += ` AND r.reply_id < $${params.length}`;
    }

    query += `
      ORDER BY r.created_at DESC, r.reply_id DESC
      LIMIT 10;
    `;

    search = await db.query(query, params);

    const result = search.rows.map(row => ({
      replyId: row.reply_id,
      postId: row.post_id,
      owner_id: row.owner_id,
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
      isEmojied: row.isEmojied,
      emojiCounts: Object.entries(row.emoji_counts || {})
        .map(([reaction, count]) => ({
          reaction,
          count: Number(count),
        }))
        .sort((a, b) => b.count - a.count),
      currentEmojiReaction: row.current_emoji_reaction
    }));

    console.log(result[0]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// React to a post (or reply)
  // Either add reaction, update reaction from opposite, or undo previous reaction
app.post("/react", async (req, res) => {
  const { postId, replyId, reactionType, reactionValue } = req.body;
  const userId = 1;

  // Defining whether a post or reply reaction, for use in queries
  const isReply = replyId != null;
  const targetId = replyId ?? postId;
  if (!targetId) {return res.status(400).json({ error: "Missing target" });}
  const idColumn = isReply ? "reply_id" : "post_id";
  const table = isReply ? "replies" : "posts";

  type ReactionType = "like" | "dislike" | "favourite" | "emoji";
  // Mapping reactionType to opposite if relevant (e.g. like -> dislike)
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

  // Reaction type isn't allowed (not one of 'like', 'dislike', 'love', 'favourite' or 'emoji')
  if (!(reactionType in oppositeReaction)) {
    return res.status(400).json({ error: "Invalid reactionType" });
  }

  try {
    await db.query("BEGIN");

    let check;
    // Selecting all reactions for post by user
    if (replyId) {
      check = await db.query(
        `SELECT reaction, reaction_value
        FROM post_reactions
        WHERE user_id = $1 AND post_id = $2 AND reply_id = $3;`,
        [userId, postId, replyId]
      );
    } else {
      check = await db.query(
        `SELECT reaction, reaction_value
        FROM post_reactions
        WHERE user_id = $1 AND post_id = $2 AND reply_id IS NULL;`,
        [userId, postId]
      );      
    }

    const reactions = new Set(check.rows.map(r => r.reaction));

    let result = null;

    const opposite = oppositeReaction[reactionType as ReactionType];
    
    // Main reaction handling logic
    if (reactions.has(reactionType) && reactionType == "emoji") {
      // User has already reacted with an emoji
  
      const prevReactionValue = check.rows
        .map(r => r.reaction_value)
        .find(v => v != null) ?? null;
      console.log("prevReactionValue", prevReactionValue);

      if (prevReactionValue == reactionValue) {
        // Delete emoji
        if (replyId) {
          result = await db.query(
            `DELETE FROM post_reactions
            WHERE user_id = $1 AND post_id = $2 AND reply_id = $3 AND reaction = $4`,
            [userId, postId, replyId, reactionType]
          );
        } else {
          result = await db.query(
            `DELETE FROM post_reactions
            WHERE user_id = $1 AND post_id = $2 AND reply_id IS NULL AND reaction = $3`,
            [userId, postId, reactionType]
          );
        }

        // Decrement count in relevant table
        if (column) {
          await db.query(
            `UPDATE ${table}
            SET emojis = emojis - 1
            WHERE ${idColumn} = $1`,
            [targetId]
          );
        }
      } else {
        // Replace previous emoji with the new one
        if (replyId) {
          result = await db.query(
            `UPDATE post_reactions
            SET reaction_value = $5
            WHERE user_id = $1 AND post_id = $2 AND reaction = $4 and reply_id = $3`,
            [userId, postId, replyId, reactionType, reactionValue]
          )
        } else {
          result = await db.query(
            `UPDATE post_reactions
            SET reaction_value = $4
            WHERE user_id = $1 AND post_id = $2 AND reaction = $3 AND reply_id IS NULL`,
            [userId, postId, reactionType, reactionValue]
          ) 
        }
      }

    } else if (reactions.has(reactionType)) {
      // User has already reacted to post

      // Delete reaction
      if (replyId) {
        result = await db.query(
          `DELETE FROM post_reactions
          WHERE user_id = $1 AND post_id = $2 AND reply_id = $3 AND reaction = $4`,
          [userId, postId, replyId, reactionType]
        );
      } else {
        result = await db.query(
          `DELETE FROM post_reactions
          WHERE user_id = $1 AND post_id = $2 AND reply_id IS NULL AND reaction = $3`,
          [userId, postId, reactionType]
        );
      }

      // Decrement count for like or dislike
      if (column) {
        await db.query(
          `UPDATE ${table}
          SET ${column} = ${column} - 1
          WHERE ${idColumn} = $1`,
          [targetId]
        );
      }
          
    } else if (opposite && reactions.has(opposite)) {
      // User currently has opposite reaction to post (i.e. has disliked and now wants to like)

      if (replyId) {
        result = await db.query(
          `UPDATE post_reactions
          SET reaction = $4
          WHERE user_id = $1 AND post_id = $2 AND reply_id = $3 AND reaction = $5`,
          [userId, postId, replyId, reactionType, oppositeReaction[reactionType as ReactionType]]
        )
      } else {
        result = await db.query(
          `UPDATE post_reactions
          SET reaction = $3
          WHERE user_id = $1 AND post_id = $2 AND reply_id IS NULL AND reaction = $4`,
          [userId, postId, reactionType, oppositeReaction[reactionType as ReactionType]]
        ) 
      }

      const negReaction = oppositeReaction[reactionType as ReactionType];
      const oppositeColumn =
        negReaction && negReaction in reactionColumns
          ? reactionColumns[negReaction as keyof typeof reactionColumns]
          : null;
      await db.query(
        `UPDATE ${table}
        SET ${column} = ${column} + 1,
            ${oppositeColumn} = ${oppositeColumn} - 1
        WHERE ${idColumn} = $1`,
        [targetId]
      );

    } else {
      // No relevant previous reaction, add into table and increment count

      if (replyId) {
        result = await db.query(
          `INSERT INTO post_reactions (user_id, post_id, reply_id, reaction, reaction_value)
          VALUES ($1, $2, $3, $4, $5)`,
          [userId, postId, replyId, reactionType, reactionValue]
        );
      } else {
        result = await db.query(
          `INSERT INTO post_reactions (user_id, post_id, reaction, reaction_value)
          VALUES ($1, $2, $3, $4)`,
          [userId, postId, reactionType, reactionValue]
        );
      }

      if (column) {
        await db.query(
          `UPDATE ${table}
          SET ${column} = ${column} + 1
          WHERE ${idColumn} = $1`,
          [targetId]
        );
      }
    }

    await db.query("COMMIT");

    res.json(result);
  } catch (err) {
    console.log(err);
    await db.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/trending", async (req, res) => {
  try {
    // Pulling 30 most recent data sources with different weighting for posts / replies / reaction types
    const { rows: result } = await db.query(
      `WITH recent_activity AS (
        SELECT 
          character_id, 
          2 AS weight, 
          created_at FROM posts

        UNION ALL

        SELECT 
          character_id, 
          1 AS weight, 
          created_at FROM replies

        UNION ALL

        SELECT
          COALESCE(p.character_id, r.character_id),
          CASE pr.reaction
            WHEN 'favourite' THEN 4
            WHEN 'like' THEN 2
            WHEN 'emoji' THEN 3
            WHEN 'dislike' THEN 1
            ELSE 1
          END,
          pr.created_at
        FROM post_reactions pr
        LEFT JOIN posts p ON pr.post_id = p.post_id
        LEFT JOIN replies r ON pr.reply_id = r.reply_id
        WHERE COALESCE(p.character_id, r.character_id) IS NOT NULL
      ),

      limited AS (
        SELECT *
        FROM recent_activity
        ORDER BY created_at DESC
        LIMIT 30
      ),

      character_scores AS (
        SELECT
          c.char_id,
          c.property_id,
          SUM(weight) AS score
        FROM limited ra
        JOIN characters c ON ra.character_id = c.char_id
        GROUP BY c.char_id, c.property_id
      ),

      property_scores AS (
        SELECT
          property_id,
          SUM(score) AS score
        FROM character_scores
        GROUP BY property_id
      )

      SELECT
        -- Top 5 characters
        COALESCE(
          (
            SELECT json_agg(t.name)
            FROM (
              SELECT c.name
              FROM character_scores cs
              JOIN characters c ON c.char_id = cs.char_id
              ORDER BY cs.score DESC
              LIMIT 5
            ) t
          ),
          '[]'::json
        ) AS "topCharacters",

        -- Top 5 properties
        COALESCE(
          (
            SELECT json_agg(t.name)
            FROM (
              SELECT prop.name
              FROM property_scores ps
              JOIN properties prop ON prop.property_id = ps.property_id
              ORDER BY ps.score DESC
              LIMIT 5
            ) t
          ),
          '[]'::json
        ) AS "topProperties";`,
      []
    );

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});