import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { generateOtp, temporaryUserData, otpStore } from 'src/utils/otp';
import { UploadService } from '../upload/upload.service';
import { sendMail } from 'src/utils/email';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  findById(userId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private uploadService: UploadService,
  ) {}
  async create(payload: CreateUserDto) {
    const { name, email, isPremium, role } = payload;
    try {
      console.log(payload.image);
      const checkUser = await this.userModel.findOne({ where: { email } });
      if (checkUser) {
        return {
          message: 'Bu email bilan royxatdan otilgan',
          statusCode: 400,
        };
      }
      const otp = generateOtp(email);
      otpStore.set(email, otp);

      const options = {
        to: email,
        subject: 'OTP kodingiz',
        text: `Kodingiz: ${otp}`,
      };
      const success = await sendMail(options);

      temporaryUserData.set(email, payload);

      return {
        message:
          'Emailingizga OTP yuborildi. Tasdiqlash uchun kodingizni kiriting.',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const storedOtp = otpStore.get(email);
      if (storedOtp !== otp) {
        return {
          message: 'OTP notogri yoki tasdiqlash muddati tugagan',
          statusCode: 400,
        };
      }

      const userData = temporaryUserData.get(email);
      if (!userData) {
        return {
          message: 'Tasdiqlash uchun vaqt tugagan yoki foydalanuvchi topilmadi',
          statusCode: 404,
        };
      }

      const imageUrl = userData.image
        ? await this.uploadService.uploadFile({
            file: userData.image,
            destination: 'uploads/user',
          })
        : null;

      const newUser = await this.userModel.create({
        ...userData,
        image: imageUrl ? imageUrl.imageUrl : null,
      });

      otpStore.delete(email);
      temporaryUserData.delete(email);

      return {
        message: 'Foydalanuvchi muvaffaqiyatli royxatdan otdi!',
        statusCode: 201,
        user: newUser,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.userModel.findAll();
  }

  async findOne(id: number) {
    return await this.userModel.findOne({ where: { id } });
  }

  async update(id: number, updatedPayload: UpdateUserDto) {
    const foundedUser = await this.userModel.findByPk(id);
    if (!foundedUser) {
      return {
        message: 'Foydalanuvchi topilmadi',
        statusCode: 404,
      };
    }

    if (updatedPayload.image) {
      if (foundedUser.image) {
        await this.uploadService.removeFile({ fileName: foundedUser.image });
      }
    }
    let updatedImageUrl = null;
    if (updatedPayload.image) {
      const image = await this.uploadService.uploadFile({
        file: updatedPayload.image,
        destination: 'uploads/user',
      });
      updatedImageUrl = image.imageUrl;
    }
    await this.userModel.update(
      {
        name: updatedPayload?.name || foundedUser.name,
        email: updatedPayload?.email || foundedUser.email,
        isPremium: updatedPayload?.isPremium || foundedUser.isPremium,
        image: updatedImageUrl ? updatedImageUrl : foundedUser.image,
        role: updatedPayload?.role || foundedUser.role,
      },
      { where: { id: id } },
    );

    return {
      message: 'User successfully updated',
    };
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      return {
        message: 'Foydalanuvchi topilmadi',
        statusCode: 404,
      };
    }
    if (user.image) {
      await this.uploadService.removeFile({ fileName: user.image });
    }
    await this.userModel.destroy({ where: { id } });

    return {
      message: 'success',
    };
  }
}
