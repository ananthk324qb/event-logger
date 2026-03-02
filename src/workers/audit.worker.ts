import { Worker } from "bullmq";
import { redisConnection } from "../infra/redis";
import { connectMongo } from "../infra/mongo";

async function start() {
  const db = await connectMongo();
  const collection = db.collection("events");

  new Worker(
    "audit-events",
    async (job) => {
      await collection.insertOne({
        ...job.data,
        createdAt: new Date(),
      });
    },
    { connection: redisConnection },
  );

  console.log("Audit Worker Running");
}

start();
