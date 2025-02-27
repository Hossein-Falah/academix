import { Server, Socket } from "socket.io";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatService } from "./support.service";
import { JwtService } from "@nestjs/jwt";
import { UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "./guard/ws.jwt.guard";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server:Server;

    constructor(
        private readonly chatService:ChatService,
        private readonly jwtService:JwtService
    ) {}

    afterInit(server:Server) {
        console.log("WebSocket Initialized");
    }

    handleConnection(client:Socket) {
        const token = client.handshake.auth.token;
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
            client['user'] = payload;
            console.log(`Client connected ${client.id} - Role: ${payload.role}`);
        } catch (error) {
            client.disconnect();
            console.log(`client disconnected: ${client.id}`);
        }
    }

    handleDisconnect(client:Socket) {
        console.log(`client disconnected: ${client.id}`);
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage("sendMessage")
    async handleMessage(
        @ConnectedSocket() client:Socket, 
        @MessageBody() data: { channel:string; senderId:string; message:string }
    ) {
        const { channel, message } = data;

        const senderId = client['user'].id;
        const senderRole = client['user'].role;

        await this.chatService.sendMessage(channel, senderId, senderRole, message);
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage("joinChannel")
    async handleJoinChannel(@ConnectedSocket() client:Socket, @MessageBody() data: { channel:string }) {
        const { channel } = data;
        const userId = client['user'].id;
        const userRole = client['user'].role;

        const history = await this.chatService.getChatHistory(channel, userId, userRole);
        client.emit("chatHistory", history);

        this.chatService.subscribeToChannel(channel, (message) => {
            this.server.to(client.id).emit('newMessage', message)
        })
    }
}