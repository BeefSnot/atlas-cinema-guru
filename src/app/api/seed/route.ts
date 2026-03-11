import { NextResponse } from "next/server";
import pool from "@/lib/db";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
];

const TITLES = [
  { title: "Galactic Wanderers", synopsis: "A crew of astronauts embarks on a perilous journey beyond the Milky Way.", released: 2023, genre: "Sci-Fi" },
  { title: "The Laughing Detective", synopsis: "A bumbling detective accidentally solves every case he stumbles into.", released: 2022, genre: "Comedy" },
  { title: "Midnight Shadows", synopsis: "A family moves into a Victorian mansion haunted by its dark past.", released: 2021, genre: "Horror" },
  { title: "Echoes of Tomorrow", synopsis: "A physicist discovers a way to send messages to her past self.", released: 2023, genre: "Sci-Fi" },
  { title: "The Last Samurai's Garden", synopsis: "An aging warrior finds peace tending to a secret garden.", released: 2020, genre: "Drama" },
  { title: "Neon Heist", synopsis: "A team of thieves plans the ultimate robbery in a cyberpunk city.", released: 2023, genre: "Action" },
  { title: "Whispers in the Fog", synopsis: "A detective navigates a city shrouded in mystery and deception.", released: 2022, genre: "Mystery" },
  { title: "Dragon's Oath", synopsis: "A young mage bonds with the last dragon to save their kingdom.", released: 2021, genre: "Fantasy" },
  { title: "Love in Translation", synopsis: "Two strangers connect over a shared love of languages in Paris.", released: 2023, genre: "Romance" },
  { title: "Iron Circuit", synopsis: "A rogue AI must choose between its creators and humanity.", released: 2022, genre: "Thriller" },
  { title: "The Great Bamboo Caper", synopsis: "A panda family goes on a hilarious quest to save their forest.", released: 2023, genre: "Animation" },
  { title: "Crimson Tide Rising", synopsis: "A marine biologist uncovers a conspiracy threatening the oceans.", released: 2021, genre: "Drama" },
  { title: "Starfall Chronicles", synopsis: "Alien refugees arrive on Earth seeking asylum and new beginnings.", released: 2023, genre: "Sci-Fi" },
  { title: "The Prank War", synopsis: "Office rivals escalate their pranks until things spiral out of control.", released: 2022, genre: "Comedy" },
  { title: "Grave Silence", synopsis: "A journalist investigates a series of mysterious disappearances.", released: 2021, genre: "Horror" },
  { title: "Velocity", synopsis: "An ex-racer must outrun a criminal syndicate across three continents.", released: 2023, genre: "Action" },
  { title: "The Clockmaker's Secret", synopsis: "A young apprentice discovers her master's timepieces hold magical powers.", released: 2022, genre: "Fantasy" },
  { title: "Hearts Across the Divide", synopsis: "A long-distance romance is tested when one partner gets a dream job abroad.", released: 2023, genre: "Romance" },
  { title: "Cold Case Files: Redux", synopsis: "A retired detective is pulled back into a case she never solved.", released: 2021, genre: "Mystery" },
  { title: "Phantom Protocol", synopsis: "A hacker uncovers a government conspiracy that puts her life in danger.", released: 2022, genre: "Thriller" },
  { title: "Dino Rangers", synopsis: "A group of kids befriend dinosaurs to protect them from poachers.", released: 2023, genre: "Animation" },
  { title: "The Weight of Mountains", synopsis: "A climber reflects on life and loss during a solo Everest ascent.", released: 2022, genre: "Drama" },
  { title: "Orbit Breakers", synopsis: "Rival space stations compete to mine the most valuable asteroid.", released: 2021, genre: "Sci-Fi" },
  { title: "Belly Laughs", synopsis: "A stand-up comedian's life unravels on the night of his biggest show.", released: 2023, genre: "Comedy" },
  { title: "The Siren's Call", synopsis: "Sailors are lured to a mysterious island by an enchanting melody.", released: 2022, genre: "Horror" },
  { title: "Desert Storm Rising", synopsis: "Special forces race against time to prevent a terrorist attack.", released: 2023, genre: "Action" },
  { title: "The Ember Crown", synopsis: "A princess must unite warring kingdoms before an ancient evil returns.", released: 2022, genre: "Fantasy" },
  { title: "Second Chances", synopsis: "Two divorcees find unexpected love at a weekend retreat.", released: 2021, genre: "Romance" },
  { title: "The Missing Hour", synopsis: "A detective tries to reconstruct events from a single missing hour.", released: 2023, genre: "Mystery" },
  { title: "Zero Day", synopsis: "A cybersecurity expert has 24 hours to stop a global infrastructure attack.", released: 2022, genre: "Thriller" },
  { title: "Pixel Pals", synopsis: "Video game characters escape their world and explore the real one.", released: 2023, genre: "Animation" },
  { title: "The River Between", synopsis: "Two families on opposite banks of a river are torn apart by a flood.", released: 2021, genre: "Drama" },
  { title: "Quantum Rift", synopsis: "Scientists accidentally open a portal to a parallel dimension.", released: 2023, genre: "Sci-Fi" },
  { title: "The Chef's Disaster", synopsis: "A world-class chef's restaurant opening goes spectacularly wrong.", released: 2022, genre: "Comedy" },
  { title: "Blackwood Manor", synopsis: "A group of paranormal investigators spend a night in a cursed manor.", released: 2023, genre: "Horror" },
  { title: "Thunder Road", synopsis: "A motorbike gang protects a small town from a criminal empire.", released: 2021, genre: "Action" },
];

export async function GET() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS titles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        synopsis TEXT,
        released INTEGER NOT NULL,
        genre VARCHAR(100) NOT NULL,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, title_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS watch_later (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, title_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
        activity_type VARCHAR(100) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
      )
    `);

    // Seed titles if empty
    const { rowCount } = await client.query("SELECT COUNT(*) FROM titles");
    if (rowCount === 0 || (await client.query("SELECT COUNT(*) FROM titles")).rows[0].count === "0") {
      for (const t of TITLES) {
        const genreIndex = GENRES.indexOf(t.genre) + 1;
        const imageNum = String(genreIndex).padStart(2, "0");
        await client.query(
          `INSERT INTO titles (title, synopsis, released, genre, image) VALUES ($1, $2, $3, $4, $5)`,
          [t.title, t.synopsis, t.released, t.genre, `/images/genre-${imageNum}.jpg`]
        );
      }
    }

    await client.query("COMMIT");
    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  } finally {
    client.release();
  }
}
