import { drizzle } from "drizzle-orm/neon-http"; // or drizzle-orm/postgres-js depending on your setup
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"; // 👈 import * as schema

const sql = neon(process.env.DATABASE_URL!);

// ✅ Register schema for full typing support
export const db = drizzle(sql, { schema });
