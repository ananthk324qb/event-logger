import { FastifyInstance } from "fastify";
import { createOrder, fetchOrder, updateOrderStatus } from "./order.service";

const orderRoutes = async (app: FastifyInstance) => {
  app.post("/order", { preHandler: [app.authenticate] }, async (req: any) => {
    const { amount } = req.body;
    const orderId = await createOrder(amount, req.user);
    return { orderId, success: true };
  });

  app.get(
    "/order/:id",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      const id = req.params.id;
      const orderDetails = await fetchOrder(id);
      return { data: orderDetails, success: true };
    },
  );

  app.patch(
    "/order/:id/status",
    { preHandler: [app.authenticate] },
    async (req: any) => {
      await updateOrderStatus(req.params.id, req.user, req.body.status);

      return { message: "Order status updated", success: true };
    },
  );
};

export default orderRoutes;
