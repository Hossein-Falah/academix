import { Server, Socket } from "socket.io";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatService } from "./support.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server:Server;

    constructor(private readonly chatService:ChatService) {}

    afterInit(server:Server) {
        console.log("WebSocket Initialized");
    }

    handleConnection(client:Socket) {
        console.log(`client connection: ${client.id}`);
    }

    handleDisconnect(client:Socket) {
        console.log(`client disconnected: ${client.id}`);
    }

    @SubscribeMessage("sendMessage")
    async handleMessage(
        @ConnectedSocket() client:Socket, 
        @MessageBody() data: { channel:string; senderId:string; message:string }
    ) {
        const { channel, senderId, message } = data;    

        await this.chatService.sendMessage(channel, senderId, message);
    }

    @SubscribeMessage("joinChannel")
    async handleJoinChannel(@ConnectedSocket() client:Socket, @MessageBody() data: { channel:string }) {
        const { channel } = data;

        const history = await this.chatService.getChatHistory(channel);
        client.emit("chatHistory", history);

        this.chatService.subscribeToChannel(channel, (message) => {
            this.server.to(client.id).emit('newMessage', message)
        })
    }
}