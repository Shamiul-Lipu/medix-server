import { NextFunction, Request, Response } from "express";
export declare class AppError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}
declare function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void;
export default globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.d.ts.map