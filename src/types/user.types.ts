export const allowedRoles = ["ADMIN", "CUSTOMER", "SELLER"] as const;

export type UserRole = (typeof allowedRoles)[number];

export type AuthUser = {
  id: string;
  role: string;
  email: string;
  name: string;
  isBanned: boolean;
};
