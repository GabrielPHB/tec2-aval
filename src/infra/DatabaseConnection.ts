import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

// Creates a single pool instance to share across the application
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

});