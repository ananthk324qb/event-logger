import { FastifyInstance } from "fastify";
import {
  createOrder,
  shipOrder,
  cancelOrder,
  fetchOrder,
} from "./order.service";

const orderRoutes = async (app: FastifyInstance) => {
  app.post("/order", { preHandler: [app.authenticate] }, async (req: any) => {
    const { amount } = req.body;
    const orderId = await createOrder(amount, req.user);
    return { orderId };
  });

  app.get(
    "/order/:id",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const id = req.params.id;
      const orderDetails = await fetchOrder(id);
      return orderDetails;
    },
  );

  app.patch(
    "/order/:id/ship",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      await shipOrder(req.params.id, req.user);
      return { success: true };
    },
  );

  app.patch(
    "/order/:id/cancel",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      await cancelOrder(req.params.id, req.user);
      return { success: true };
    },
  );
};

export default orderRoutes;
