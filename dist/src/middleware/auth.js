import { auth } from "../lib/auth";
export const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers,
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
                role: session.user.role,
                isBanned: session.user.isBanned,
            };
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden - Insufficient permissions",
                });
            }
            req.session = session;
            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        }
    };
};
//# sourceMappingURL=auth.js.map