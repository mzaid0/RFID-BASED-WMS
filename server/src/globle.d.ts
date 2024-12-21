import { $Enums, Prisma } from "@prisma/client";

export {};

declare global {
  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  };
  type LooseObject = {
    [key: string]: any;
  };
  type LooseStringObject = {
    [key: string]: string;
  };

  namespace Express {
    interface Request {
      user?: User;
      filesPaths?: {
        [key: string]: string[];
      };
    }
  }

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string | null;
    role: $Enums.Role;
    warehouseId: string | null;
  };
}
