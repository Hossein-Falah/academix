import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";

@Controller('auth')
@ApiTags("Google Auth")
@UseGuards(AuthGuard("google"))
export class GoogleAuthController {
    constructor(
        private authService:AuthService
    ) {}
    @Get("/google")
    async googleAuth() {
        return {
            message: "Redirecting to Google OAuth ..."
        }
    }

    @Get('/google.redirect')
    async googleAuthRedirect(@Req() req) {
        const userData = req.user;        
        return this.authService.googleAuth(userData);
    }
}