import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ProfileEntity } from "src/modules/user/entities/profile.entity";
// import { ProfileEntity } from "src/modules/user/entities/profile.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CIIENT_SECRET,
            callbackURL: process.env.GOOGLE_CLLBACK_URL,
            scope: ["email", "profile"],
        })
    }

    async validate(accessToken:string,refreshToken:string,profile:any,done:VerifyCallback): Promise<any> {        
        const { name, emails, photos } = profile;
        const { givenName:firstName, familyName:lastName } = name;
        const [emailData] = emails;
        const [image] = photos;

        const User = {
            firstName,
            lastName,
            email: emailData?.value,
            image_profile: image?.value,
            accessToken
        };

        done(null, User);
    }
}