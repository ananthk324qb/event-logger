import { MongoClient, Db } from "mongodb";

let db: Db;

export async function initMongo() {
  const client = new MongoClient(process.env.MONGO_URL!);

  await client.connect();

  db = client.db("auditDB");

  console.log("Mongo connected");
}

export function getMongo() {
  if (!db) throw new Error("Mongo not initialized");

  return db;
}
