export declare const allowedRoles: readonly ["ADMIN", "CUSTOMER", "SELLER"];
export type UserRole = (typeof allowedRoles)[number];
export type AuthUser = {
    id: string;
    role: string;
    email: string;
    name: string;
    isBanned: boolean;
};
//# sourceMappingURL=user.types.d.ts.map