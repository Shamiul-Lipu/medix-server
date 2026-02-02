export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    user: {
        additionalFields: {
            role: {
                type: "string";
                required: true;
                defaultValue: string;
            };
            phone: {
                type: "string";
                required: false;
            };
            address: {
                type: "string";
                required: true;
            };
            isBanned: {
                type: "boolean";
                required: true;
                defaultValue: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        requireEmailVerification: false;
    };
}>;
//# sourceMappingURL=auth.d.ts.map