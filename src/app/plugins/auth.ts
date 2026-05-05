import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { ErrorTemplate } from "../../common/error";

export default fp(async function (app) {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
  });

  app.decorate("authenticate", async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch {
      reply.code(401);
      throw new ErrorTemplate("Unauthorized", 401);
    }
  });
});
