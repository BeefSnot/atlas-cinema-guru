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
  {
    title: "Toy Story",
    synopsis: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    released: 1995,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgwNjRmNzC4xZmNmZGUxXkEyXkFqcGdeQXVyNDMwNjAzNjQ@._V1_SX300.jpg"
  },
  {
    title: "Finding Nemo",
    synopsis: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
    released: 2003,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BgWEwNjQ4ZWMtZWFkMi00ZDNiLTk2ZmUtZThhZWExMTg0ZGIZXkEyXkFqcGc@._V1_SX300.jpg"
  },
  {
    title: "The Incredibles",
    synopsis: "While trying to lead a quiet suburban life, a family of undercover superheroes are forced into action to save the world.",
    released: 2004,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BMTY5OTU0OTc2NV5BMl5BanBnXkFtZTcwMzU4MDcyMQ@@._V1_SX300.jpg"
  },
  {
    title: "Up",
    synopsis: "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.",
    released: 2009,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BMTk3NDE2NzI4NF5BMl5BanBnXkFtZTgwNzE1MzEyMTE@._V1_SX300.jpg"
  },
  {
    title: "WALL·E",
    synopsis: "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    released: 2008,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX300.jpg"
  },
  {
    title: "Monsters, Inc.",
    synopsis: "In order to power the city, monsters have to scare children so that they shriek. However, the children are toxic to the monsters.",
    released: 2001,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BMTY1NTI0ODUyOF5BMl5BanBnXkFtZTgwNTEyNjQ0OTE@._V1_SX300.jpg"
  },
  {
    title: "The Maze Runner",
    synopsis: "Thomas is deposited in a community of boys after his memory is erased, soon learning they're all trapped in a maze that will require him to join forces with fellow runners for a shot at escape.",
    released: 2014,
    genre: "Sci-Fi",
    image: "https://m.media-amazon.com/images/M/MV5BMjUyNTA3MTAyM15BMl5BanBnXkFtZTgwOTEyMTkyMjE@._V1_SX300.jpg"
  },
  {
    title: "Maze Runner: The Scorch Trials",
    synopsis: "After having escaped the Maze, the Gladers now face a new set of challenges on the open roads of a desolate landscape filled with unimaginable obstacles.",
    released: 2015,
    genre: "Sci-Fi",
    image: "https://m.media-amazon.com/images/M/MV5BMTA5NDMwNjAwMDJeQTJeQWpwZ15BbWU4MDUxOTEzODUz._V1_SX300.jpg"
  },
  {
    title: "Maze Runner: The Death Cure",
    synopsis: "Young hero Thomas embarks on a mission to find a cure for a deadly disease known as the Flare.",
    released: 2018,
    genre: "Sci-Fi",
    image: "https://m.media-amazon.com/images/M/MV5BMTYyNzk3NDc4N15BMl5BanBnXkFtZTgwOTE1NjI3NDM@._V1_SX300.jpg"
  },
  {
    title: "The Matrix",
    synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    released: 1999,
    genre: "Sci-Fi",
    image: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
  },
  {
    title: "Interstellar",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    released: 2014,
    genre: "Sci-Fi",
    image: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDMtY2FlYy00ZTk2LTg2YjEtY2ZkNjgyZmVhMDMxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"
  },
  {
    title: "Inception",
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    released: 2010,
    genre: "Sci-Fi",
    image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
  },
  {
    title: "The Dark Knight",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    released: 2008,
    genre: "Action",
    image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0Nl5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg"
  },
  {
    title: "Avengers: Endgame",
    synopsis: "After the devastating events of Infinity War, the Avengers assemble once more in order to reverse Thanos' actions.",
    released: 2019,
    genre: "Action",
    image: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg"
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    synopsis: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    released: 2018,
    genre: "Animation",
    image: "https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg"
  }
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
