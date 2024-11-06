// import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
// import { AuthService } from "./auth.service";
// import { AuthGuard } from "@nestjs/passport";
// import {Response} from 'express'
// @Controller('auth')
// export class AuthController{
//     constructor(private authService: AuthService){}
    
//     @UseGuards(AuthGuard('google'))
//     @Get("/google")
//     googleAuth(){}

//     @UseGuards(AuthGuard('google'))
//     @Get('/google/sign-in')
//     async googleAuthCallback(@Req() request: any,@Res() response: Response){
//         return await this.authService.googleAuth(request,response)

//     }

//     @Post('login')
//     async login(@Body() email: string){
//         return await this.authService.login(email)
//     }
//     @Post('login-verify')
//     async loginOtp(@Body() body: {email: string,otp: string}){
//         const {email,otp} = body
//         return await this.authService.verifyLoginOtp(email,otp)
//     }
// }




import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('google'))
    @Get('/google')
    googleAuth() {}

    @UseGuards(AuthGuard('google'))
    @Get('/google/sign-in')
    async googleAuthCallback(@Req() req: any, @Res() res: Response) {
        return await this.authService.googleAuth(req, res);
    }

    @Post('login')
    async login(@Body('email') email: string) {
        return await this.authService.login(email);
    }

    @Post('login-verify')
    async loginOtp(@Body() body: { email: string, otp: string }) {
        const { email, otp } = body;
        return await this.authService.verifyLoginOtp(email, otp);
    }
}
