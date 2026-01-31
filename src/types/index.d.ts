import { UserRole } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        isBanned: boolean;
      };
      session?: any;
    }
  }
}
