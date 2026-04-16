import { FastifyInstance } from "fastify";

const authRoutes = async (app: FastifyInstance) => {
  app.post("/login", async () => {
    const token = app.jwt.sign({
      userId: "789",
      role: "ADMIN",
    });
    return { token };
  });
};

export default authRoutes;
