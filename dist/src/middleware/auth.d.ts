import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user.types";
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map