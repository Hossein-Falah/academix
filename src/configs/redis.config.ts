import { Logger } from "@nestjs/common";
import Redis, { RedisOptions } from "ioredis";

const logger = new Logger("RedisConfig");

export const redisConfig: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Retrying Redis connection (${times} attempts) ...`)
        return delay;
    }
}

export const createRedisInstance = (options:RedisOptions = redisConfig): Redis => {
    const redis = new Redis(options);

    // status connection
    let isConnected = false;

    redis.on("ready", () => {
        logger.log(`Redis is ready to accept commands 🚀`);
    });

    redis.on("connect", () => {
        isConnected = true;
        logger.log(`Redis Connected successfully ✅`);
    });

    redis.on('error', (err) => {
        isConnected = false;
        logger.error(`Redis Connected closed ❌`, err.message);
    });

    redis.on('end', () => {
        isConnected = false;
        logger.warn(`Redis connection closed 😊`);
    });

    redis.on("reconnecting", (time:string) => {
        logger.log(`Reconnected to Redis in ${time}ms ⌛`);
    });

    (redis as any).isConnected = () => isConnected;

    return redis
}

export const redisPublisher = createRedisInstance();
export const redisSubscriber = createRedisInstance();