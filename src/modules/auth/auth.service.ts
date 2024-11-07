// import { Injectable, BadRequestException, NotFoundException, Response } from "@nestjs/common";
// import { InjectModel } from "@nestjs/sequelize";
// import { JwtService } from "@nestjs/jwt";
// import { User } from "../user/model";
// import { generateOtp, validateOtp } from "src/utils/otp";
// import { sendMail } from "src/utils/email";

// @Injectable()
// export class AuthService {
//     constructor(
//         @InjectModel(User) private userModel: typeof User,
//         private jwt: JwtService
//     ) {}

//     async googleAuth(req: any, @Response() res) {
//         if (!req.user) {
//             throw new BadRequestException('User information not provided');
//         }

//         const email = req.user.emails[0]?.value;
//         if (!email) {
//             throw new BadRequestException('Email not found in request');
//         }

//         let user = await this.userModel.findOne({ where: { email } });

//         if (!user) {
//             user = await this.userModel.create({
//                 name: req.user.displayName,
//                 email,
//                 image: req.user.photos[0]?.value
//             });
//         }

//         const accessToken = this.jwt.sign(
//             { id: user.id, role: user.role },
//             { secret: 'my-secret-key', expiresIn: '1h' }
//         );
//         const refreshToken = this.jwt.sign(
//             { id: user.id },
//             { secret: 'my-refresh-token-key',expiresIn: '30d', }
//         );

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             maxAge: 30 * 24 * 60 * 60 * 1000
//         });

//         return res.json({
//             accessToken,
//             user,
//             isNew: !user
//         });
//     }
//     async login(email: string) {
//         if (!email) {
//             throw new BadRequestException('Email kiritilishi kerak');
//         }
//         console.log("Email to send OTP:", email);

//         const otp = generateOtp(email);
//         const options = {
//             to: email, // Ensure the 'to' field is filled with recipient's email
//             subject: 'Sizning OTP kodingiz',
//             text: `Kodingiz: ${otp}`
//         };

//         try {
//             const result = await sendMail(options);
//             if (!result) {
//                 throw new Error('Email could not be sent');
//             }
//         } catch (error) {
//             throw new BadRequestException(`Error on email: ${error.message}`);
//         }

//         return {
//             message: 'Emailingizga OTP yuborildi. Tasdiqlash uchun kodingizni kiriting.',
//             statusCode: 200,
//         };
//     }

//     async verifyLoginOtp(email: string, otp: string) {
//         const isValidOtp = validateOtp(email, otp);
//         if (!isValidOtp) {
//             throw new BadRequestException('Notogri OTP yoki tasdiqlash muddati tugadi');
//         }

//         const user = await this.userModel.findOne({ where: { email } });
//         if (!user) {
//             throw new NotFoundException('Foydalanuvchi topilmadi');
//         }

//         const accessToken = this.jwt.sign(
//             { id: user.id, role: user.role },
//             { secret: 'my-secret-key', expiresIn: '2h' }
//         );

//         return {
//             accessToken,
//             user,
//             message: 'Login successful',
//             statusCode: 200,
//         };
//     }
// }

// async refreshAccessToken(refreshToken: string, @Response() res) {
//     try {
//         const payload = this.jwt.verify(refreshToken, { secret: 'my-refresh-token-key' });
//         const accessToken = this.jwt.sign(
//             { id: payload.id, role: payload.role },
//             { secret: 'my-secret-key', expiresIn: '1h' }
//         );
//         return res.status(200).json({ accessToken });
//     } catch (error) {
//         throw new BadRequestException('Invalid or expired refresh token');
//     }
// }

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Response,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { generateOtp, validateOtp } from 'src/utils/otp';
import { sendMail } from 'src/utils/email';
import { User } from '../user/model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwt: JwtService,
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
        image: req.user.photos[0]?.value,
      });
    }

    const accessToken = this.jwt.sign(
      { id: user.id, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '2h' },
    );
    const refreshToken = this.jwt.sign(
      { id: user.id },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '30d' },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user,
      isNew: !user,
    });
  }

  async login(email: string) {
    if (!email) {
      throw new BadRequestException('Email address is required');
    }

    const otp = generateOtp(email);
    const options = {
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    try {
      await sendMail(options);
    } catch (error) {
      throw new BadRequestException(`Error sending email: ${error.message}`);
    }

    return {
      message: 'OTP sent to your email. Please check your inbox.',
      statusCode: 200,
      otp,
    };
  }

  async verifyLoginOtp(email: string, otp: string) {
    const isValidOtp = validateOtp(email, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessToken = this.jwt.sign(
      { id: user.id, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '24h' },
    );

    const refreshToken = this.jwt.sign(
      { id: user.id, role: user.role },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '30d' },
    );

    return {
      accessToken,
      refreshToken,
      user,
      message: 'Login successful',
      statusCode: 200,
    };
  }

  async refreshAccessToken(refreshToken: string, @Response() res) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const accessToken = this.jwt.sign(
        { id: payload.id, role: payload.role },
        { secret: 'my-secret-key', expiresIn: '1h' },
      );
      return res.status(200).json({ accessToken });
    } catch (error) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }
}
