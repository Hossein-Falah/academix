import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookiePayload } from "src/common/types";

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
}