import { FastifyInstance } from "fastify";
import { createOrder, shipOrder, cancelOrder } from "./order.service";

const orderRoutes = async (app: FastifyInstance) => {
  app.post("/orders", { preHandler: [app.authenticate] }, async (req: any) => {
    const { amount } = req.body;
    const id = await createOrder(amount, req.user);
    return { id };
  });

  app.patch(
    "/orders/:id/ship",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      await shipOrder(req.params.id, req.user);
      return { success: true };
    },
  );

  app.patch(
    "/orders/:id/cancel",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      await cancelOrder(req.params.id, req.user);
      return { success: true };
    },
  );
};

export default orderRoutes;
