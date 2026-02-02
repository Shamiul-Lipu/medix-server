import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.API_URL],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "CUSTOMER",
            },
            phone: {
                type: "string",
                required: false,
            },
            address: {
                type: "string",
                required: true,
            },
            isBanned: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        // autoSignIn: true,
        requireEmailVerification: false,
    },
});
//# sourceMappingURL=auth.js.map