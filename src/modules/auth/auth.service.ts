import { Injectable, BadRequestException, NotFoundException, Response } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/model";
import { generateOtp, validateOtp } from "src/utils/otp";
import { sendMail } from "src/utils/email";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwt: JwtService
    ) {}

    async googleAuth(req: any, @Response() res) {
        if (!req.user) {
            throw new BadRequestException('User information not provided');
        }

        const email = req.user.emails[0]?.value;
        if (!email) {
            throw new BadRequestException('Email not found in request');
        }

        let user = await this.userModel.findOne({ where: { email } });

        if (!user) {
            user = await this.userModel.create({
                name: req.user.displayName,
                email,
                image: req.user.photos[0]?.value
            });
        }

        const accessToken = this.jwt.sign(
            { id: user.id, role: user.role },
            { secret: 'my-secret-key', expiresIn: '1h' }
        );
        const refreshToken = this.jwt.sign(
            { id: user.id },
            { secret: 'my-refresh-secret-key', expiresIn: '30d' }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.json({
            accessToken,
            user,
            isNew: !user
        });
    }

    async login(email: string) {
        if (!email) {
            throw new BadRequestException('Email kiritilishi kerak');
        }

        const otp = generateOtp(email);
        const options = {
            to: email,
            subject: 'Sizning OTP kodingiz',
            text: `Kodingiz: ${otp}`
        };

        try {
            await sendMail(options);
        } catch (error) {
            throw new BadRequestException(`Error on email: ${error.message}`);
        }

        return {
            message: 'Emailingizga OTP yuborildi. Tasdiqlash uchun kodingizni kiriting.',
            statusCode: 200,
        };
    }

    async verifyLoginOtp(email: string, otp: string) {
        const isValidOtp = validateOtp(email, otp);
        if (!isValidOtp) {
            throw new BadRequestException('Notogri OTP yoki tasdiqlash muddati tugadi');
        }

        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }

        const accessToken = this.jwt.sign(
            { id: user.id, role: user.role },
            { secret: 'my-secret-key', expiresIn: '2h' }
        );

        return {
            accessToken,
            user,
            message: 'Login successful',
            statusCode: 200,
        };
    }
}
