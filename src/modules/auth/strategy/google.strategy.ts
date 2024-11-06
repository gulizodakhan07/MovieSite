import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import  {Strategy, VerifyCallback} from 'passport-google-oauth2'
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,"google"){
    constructor(){
        super({
            clientID: process.env.GOOGLE_OATH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OATH_CLIENT_SECRET,
            callbackURL: "http://localhost:4070/auth/google/sign-in",
            scope: ["email","profile"]
        })
    }


    
    authorizationParams(options: any): object{
        return {
            prompt: "consent",
            access_type: "offline"
        }
    }
    async validate(accessToken: string,refreshToken: string,profile: any,cb: VerifyCallback){

        return cb(null,{...profile,refreshToken,accessToken})
    }

}