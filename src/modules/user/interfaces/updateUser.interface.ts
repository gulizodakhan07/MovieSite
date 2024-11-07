import { UserRoles } from '../model/user.model';

export declare interface UpdateUserRequest {
  name?: string;
  email?: string;
  isPremium?: boolean;
  image?: Express.Multer.File;
  role?: UserRoles;
}
