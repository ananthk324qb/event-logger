import { FastifyInstance } from "fastify";
import { getMongo } from "../infra/mongo";

const eventRoutes = (app: FastifyInstance) => {
  app.get(
    "/audit/:entityType/:entityId",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const db = getMongo();
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
};

export default eventRoutes;
