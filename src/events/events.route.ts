import { FastifyInstance } from "fastify";
import { getMongo } from "../infra/mongo";

const eventRoutes = (app: FastifyInstance) => {
  app.get("/events", { preHandler: [app.authenticate] }, async (req: any) => {
    const { type, id } = req.query as any;

    const db = getMongo();
    const events = await db
      .collection("events")
      .find({
        entityType: type,
        entityId: id,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return events;
  });
};

export default eventRoutes;
