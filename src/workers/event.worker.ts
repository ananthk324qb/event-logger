import "dotenv/config";
import { Worker } from "bullmq";
import { redisConfig } from "../infra/redis";
import { getMongo, initMongo } from "../infra/mongo";

async function start() {
  await initMongo();

  const db = getMongo();
  const collection = db.collection("events");

  new Worker(
    "events",
    async (job) => {
      try {
        await collection.insertOne({
          ...job.data,
          createdAt: new Date(),
        });

        console.log(
          JSON.stringify({
            level: "info",
            message: "Event stored",
            entityId: job.data.entityId,
          }),
        );
      } catch (e) {
        console.error("Event insert failed", e);
      }
    },
    { connection: redisConfig },
  );

  console.log("Event worker running");
}

start();
