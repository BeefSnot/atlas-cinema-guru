import pool from "./db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export type Title = {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  image: string;
  favorited?: boolean;
  watchLater?: boolean;
};

export type Activity = {
  id: string;
  title_id: string;
  title: string;
  activity_type: string;
  timestamp: string;
};

// ─── Titles ────────────────────────────────────────────────────────────────

export async function getTitles({
  page = 1,
  minYear,
  maxYear,
  genres,
  search,
}: {
  page?: number;
  minYear?: number;
  maxYear?: number;
  genres?: string[];
  search?: string;
} = {}): Promise<Title[]> {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const limit = 6;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: (string | number | string[])[] = [];
  let i = 1;

  if (minYear) { conditions.push(`t.released >= $${i++}`); values.push(minYear); }
  if (maxYear) { conditions.push(`t.released <= $${i++}`); values.push(maxYear); }
  if (genres && genres.length > 0) { conditions.push(`t.genre = ANY($${i++})`); values.push(genres); }
  if (search) { conditions.push(`t.title ILIKE $${i++}`); values.push(`%${search}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const favSub = userId
    ? `EXISTS(SELECT 1 FROM favorites f WHERE f.title_id = t.id AND f.user_id = $${i++}) AS favorited,`
    : "false AS favorited,";
  const wlSub = userId
    ? `EXISTS(SELECT 1 FROM watch_later w WHERE w.title_id = t.id AND w.user_id = $${i++}) AS "watchLater"`
    : `false AS "watchLater"`;

  if (userId) values.push(userId, userId);

  values.push(limit, offset);

  const q = `
    SELECT t.*, ${favSub} ${wlSub}
    FROM titles t
    ${where}
    ORDER BY t.released DESC, t.title ASC
    LIMIT $${i} OFFSET $${i + 1}
  `;

  const result = await pool.query(q, values);
  return result.rows;
}

export async function getTitleById(id: string): Promise<Title | null> {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const vals: (string)[] = [id];
  let i = 2;

  const favSub = userId
    ? `EXISTS(SELECT 1 FROM favorites f WHERE f.title_id = t.id AND f.user_id = $${i++}) AS favorited,`
    : "false AS favorited,";
  const wlSub = userId
    ? `EXISTS(SELECT 1 FROM watch_later w WHERE w.title_id = t.id AND w.user_id = $${i++}) AS "watchLater"`
    : `false AS "watchLater"`;

  if (userId) vals.push(userId, userId);

  const q = `
    SELECT t.*, ${favSub} ${wlSub}
    FROM titles t
    WHERE t.id = $1
  `;

  const result = await pool.query(q, vals);
  return result.rows[0] ?? null;
}

// ─── Favorites ─────────────────────────────────────────────────────────────

export async function getFavorites({
  page = 1,
  userId,
}: {
  page?: number;
  userId: string;
}): Promise<Title[]> {
  const limit = 6;
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT t.*, true AS favorited,
      EXISTS(SELECT 1 FROM watch_later w WHERE w.title_id = t.id AND w.user_id = $1) AS "watchLater"
     FROM titles t
     JOIN favorites f ON f.title_id = t.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

export async function addFavorite(userId: string, titleId: string): Promise<void> {
  await pool.query(
    `INSERT INTO favorites (user_id, title_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, titleId]
  );
  await logActivity(userId, titleId, "FAVORITED");
}

export async function removeFavorite(userId: string, titleId: string): Promise<void> {
  await pool.query(
    `DELETE FROM favorites WHERE user_id = $1 AND title_id = $2`,
    [userId, titleId]
  );
  await logActivity(userId, titleId, "UNFAVORITED");
}

// ─── Watch Later ────────────────────────────────────────────────────────────

export async function getWatchLater({
  page = 1,
  userId,
}: {
  page?: number;
  userId: string;
}): Promise<Title[]> {
  const limit = 6;
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT t.*,
      EXISTS(SELECT 1 FROM favorites f WHERE f.title_id = t.id AND f.user_id = $1) AS favorited,
      true AS "watchLater"
     FROM titles t
     JOIN watch_later w ON w.title_id = t.id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

export async function addWatchLater(userId: string, titleId: string): Promise<void> {
  await pool.query(
    `INSERT INTO watch_later (user_id, title_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, titleId]
  );
  await logActivity(userId, titleId, "WATCH_LATER");
}

export async function removeWatchLater(userId: string, titleId: string): Promise<void> {
  await pool.query(
    `DELETE FROM watch_later WHERE user_id = $1 AND title_id = $2`,
    [userId, titleId]
  );
  await logActivity(userId, titleId, "REMOVED_WATCH_LATER");
}

// ─── Activities ─────────────────────────────────────────────────────────────

export async function getActivities({
  page = 1,
  userId,
}: {
  page?: number;
  userId: string;
}): Promise<Activity[]> {
  const limit = 5;
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT a.*, t.title
     FROM activities a
     JOIN titles t ON t.id = a.title_id
     WHERE a.user_id = $1
     ORDER BY a.timestamp DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

async function logActivity(
  userId: string,
  titleId: string,
  activityType: string
): Promise<void> {
  await pool.query(
    `INSERT INTO activities (user_id, title_id, activity_type) VALUES ($1, $2, $3)`,
    [userId, titleId, activityType]
  );
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function registerUser(
  username: string,
  password: string,
  email?: string
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  // Check if username already taken
  const existing = await pool.query(
    "SELECT id FROM users WHERE username = $1",
    [username]
  );
  if (existing.rowCount && existing.rowCount > 0) {
    return { success: false, error: "Username already taken" };
  }

  const hash = await bcrypt.hash(password, 12);

  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id`,
    [username, hash, email ?? null]
  );

  return { success: true, id: rows[0].id };
}
