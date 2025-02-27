import Redis from "ioredis";
import { Injectable } from "@nestjs/common";
import { redisPublisher, redisSubscriber } from "src/configs/redis.config";

@Injectable()
export class ChatService {
    private publisher: Redis;
    private subscriber: Redis ;

    constructor() {
        this.publisher = redisPublisher;
        this.subscriber = redisSubscriber
    }

    async sendMessage(channel: string, senderId: string, senderRole: string, message: string) {
        const messageData = {
            senderId,
            message,
            senderRole,
            timestamp: new Date().toISOString()
        };

        await this.publisher.lpush(`chat:${channel}`, JSON.stringify(messageData));

        await this.publisher.ltrim(`chat:${channel}`, 0, 99);

        await this.publisher.publish(channel, JSON.stringify(messageData));
    }

    async subscribeToChannel(channel: string, callback: (message: any) => void) {
        await this.subscriber.subscribe(channel);
        this.subscriber.on("message", (chan, msg) => {
            if (chan === channel) {
                callback(JSON.parse(msg))
            }
        })
    }

    async getChatHistory(channel: string, userId: string, role: string): Promise<any[]> {
        const messages = await this.publisher.lrange(`chat:${channel}`, 0, -1);
        return messages.map(message => JSON.parse(message))
            .filter(message => {
                return role === "admin" || role === "teacher" || role === "user" || message.senderId === userId
            }).reverse()
    }

    async disconnect() {
        await this.publisher.quit();
        await this.subscriber.quit();
    }
}