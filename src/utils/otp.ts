import { CreateUserDto } from "src/modules/user/dto";

export const otpStore = new Map<string, string>();
export const temporaryUserData = new Map<string, CreateUserDto>();

export function generateOtp(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  return otp;
}

export function validateOtp(email: string, otp: string): boolean {
  const storedOtp = otpStore.get(email);
  if (storedOtp === otp) {
    otpStore.delete(email);
    return true;
  }
  return false;
}
