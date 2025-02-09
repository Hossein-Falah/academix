import { Request } from "express";
import { isJWT } from "class-validator";
import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../services/auth.service";
import { UserStatus } from "src/common/enums/status.enum";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService:AuthService,
        private reflector:Reflector
    ) {}

    async canActivate(context: ExecutionContext) {
        const isSkippedAuthorization = this.reflector.get(SKIP_AUTH, context.getHandler());
        if (isSkippedAuthorization) return true;
        const httpContext = context.switchToHttp();
        const request:Request = httpContext.getRequest<Request>();
        
        const token = this.extractToken(request);

        request.user = await this.authService.validateAccessToken(token);
                
        if (request?.user?.status === UserStatus.Block) {
            throw new ForbiddenException(AuthMessage.Blocked)
        }

        return true;
    }

    protected extractToken(request:Request) {
        const { authorization } = request.headers;
        if (!authorization || authorization?.trim() === "") {
            throw new UnauthorizedException(AuthMessage.LoginRequired);
        }

        const [bearer, token] = authorization.split(" ");

        if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
            throw new UnauthorizedException(AuthMessage.LoginRequired);
        }

        return token
    }
}