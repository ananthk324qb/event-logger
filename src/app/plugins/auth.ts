import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async function (app) {
  await app.register(jwt, {
    secret: "super-secret",
  });

  app.decorate("authenticate", async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch {
      reply.code(401);
      throw new Error("Unauthorized");
    }
  });
});
