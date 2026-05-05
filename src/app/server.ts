import "dotenv/config";
import Fastify from "fastify";
import authPlugin from "./plugins/auth";
import { initMongo } from "../infra/mongo";
import orderRoutes from "../orders/order.routes";
import authRoutes from "../auth/auth.route";
import eventRoutes from "../events/events.route";
import { isHttpError } from "../common/error";

initMongo();

async function start() {
  const app = Fastify({ logger: true });

  await app.register(authPlugin);

  app.setErrorHandler((error, req, reply) => {
    const status = isHttpError(error)
      ? error.statusCode
      : (error as { statusCode?: number }).statusCode || 500;
    const errorMessage =
      error instanceof Error ? error.message : "Bad Request";
    const message =
      status >= 500 ? "Internal Server Error" : errorMessage;

    req.log.error(error);

    reply.status(status).send({
      success: false,
      message,
    });
  });

  await app.register(authRoutes);
  await app.register(orderRoutes);
  await app.register(eventRoutes);

  const port = Number(process.env.PORT);

  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`Server running on http://localhost:${port}`);
}

start();
