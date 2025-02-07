import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthMessage } from "src/common/enums/message.enum";
import { AccessTokenPayload, CookiePayload } from "src/common/types";

@Injectable()
export class TokenService {
    constructor(
        private jwtService:JwtService
    ) {}

    generateOtpToken(payload:CookiePayload) {
        const token = this.jwtService.sign(payload, {
            secret: process.env.OTP_TOKEN_SECRET,
            expiresIn: 60 * 2
        });

        return token;
    }

    verifyOtpToken(token:string) {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.OTP_TOKEN_SECRET
            })
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.TryAgain);
        }
    }

    generateAccessToken(payload: AccessTokenPayload) {
        try {
            const token = this.jwtService.sign(payload, {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn:  "1y"
            });

            return token;
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.TryAgain);
        }
    }
    
    verifyAccessToken(token: string): AccessTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET
            })
        } catch (error) {
            throw new UnauthorizedException(AuthMessage.LoginAgain);
        }
    }
}