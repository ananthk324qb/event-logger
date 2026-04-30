import IORedis from "ioredis";

export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

export const redisConnection = new IORedis(redisConfig);
