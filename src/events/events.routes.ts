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

  app.get(
    "/events/log",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const { from, to, type } = req.query as any;

      if (!from || !to || !type) {
        throw new ErrorTemplate("Type, from and to params required", 400);
      }

      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
        throw new ErrorTemplate("Invalid from and to params", 400);
      }

      if (fromDate > toDate) {
        throw new ErrorTemplate(
          "From date must be less than or equal to to date",
          400,
        );
      }

      const db = getMongo();
      const events = await db
        .collection("events")
        .find({
          entityType: type,
          createdAt: {
            $gte: fromDate,
            $lte: toDate,
          },
        })
        .sort({ createdAt: -1 })
        .toArray();

      return { data: events, success: true };
    },
  );
};

export default eventRoutes;
