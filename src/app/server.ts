import Fastify from "fastify";
import authPlugin from "./plugins/auth";
import orderRoutes from "../orders/order.routes";
import { connectMongo } from "../infra/mongo";

async function start() {
  await connectMongo();

  const app = Fastify({ logger: true });

  await app.register(authPlugin);

  app.post("/login", async () => {
    const token = app.jwt.sign({
      userId: "admin45",
      role: "ADMIN",
    });
    return { token };
  });

  await app.register(orderRoutes);

  app.get(
    "/audit/:entityType/:entityId",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const db = await connectMongo();
      const events = await db
        .collection("events")
        .find({
          entityType: req.params.entityType,
          entityId: req.params.entityId,
        })
        .sort({ createdAt: -1 })
        .toArray();

      return events;
    },
  );

  await app.listen({ port: 3000, host: "0.0.0.0" });
}

start();
