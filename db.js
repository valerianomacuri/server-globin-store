import { Low, JSONFile } from "lowdb";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __newdirname = dirname(fileURLToPath(import.meta.url));

let db;

export async function createConnection() {
  // Use JSON file for storage
  const file = join(__newdirname, "db.json");
  const adapter = new JSONFile(file);
  db = new Low(adapter);

  // Read data from JSON file, this will set db.data content
  await db.read();

  db.data ||= { orders: [] };
  // Write db.data content to db.json
  await db.write();
}

export const getConnection = () => db;
