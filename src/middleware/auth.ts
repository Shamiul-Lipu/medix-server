import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user.types";
import { auth } from "../lib/auth";

export const authorize = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Please login",
        });
      }

      // Check if user is banned
      if (session.user.isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned",
        });
      }
      // console.log(session, req.user);

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        isBanned: session.user.isBanned,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Insufficient permissions",
        });
      }

      req.session = session;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }
  };
};
