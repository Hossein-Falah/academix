import { JwtService } from "@nestjs/jwt";
import { CanActivate, ExecutionContext } from "@nestjs/common";

export class WsJwtGuard implements CanActivate {
    constructor(private jwtService:JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        const token = client.handshake.auth.token;

        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
            client['user'] = payload;
            return true;
        } catch (error) {
            return false;
        }
    }
}