import { FastifyInstance } from "fastify";
import { getMongo } from "../infra/mongo";
import { ErrorTemplate } from "../common/error";

const eventRoutes = (app: FastifyInstance) => {
  app.get("/events", { preHandler: [app.authenticate] }, async (req: any) => {
    const { type, id } = req.query as any;

    if (!type || !id) {
      throw new ErrorTemplate("Params type and id are required", 400);
    }

    const db = getMongo();
    const events = await db
      .collection("events")
      .find({
        entityType: type,
        entityId: id,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return { data: events, success: true };
  });
};

export default eventRoutes;
