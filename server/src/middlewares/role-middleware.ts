import { NextFunction, Request, Response } from "express";
import { Role } from "shared/types/role";
// Custom Request type that includes the `user` property

export const authorizeRoles = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.user exists and check if role is authorized

    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role ${req.user?.role} is not authorized to access this resource`,
      });
      return;
    }
    next();
  };
};
