import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService:UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        })
    }

    async validate(payload:any) {
        const user = await this.userService.getProfileWithId(payload.sub);
        return { 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            phone: user.phone,
            image: user.profile.image_profile,
            nike_name: user.profile.nike_name
        }
    }
}