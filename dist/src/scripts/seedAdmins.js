import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
export async function seedAdmin() {
    try {
        // Useing BETTER_AUTH_URL directly , check .env
        const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "http://localhost:5000";
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();
        const ADMIN_NAME = process.env.ADMIN_NAME?.trim();
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
            console.log("[SeedAdmin] Skipped - Missing credentials");
            return;
        }
        const existingAdmin = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
            select: { id: true, role: true },
        });
        if (existingAdmin) {
            console.log("[SeedAdmin] Admin already exists");
            return;
        }
        console.log("[SeedAdmin] Creating admin user...");
        const response = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: BETTER_AUTH_URL,
            },
            body: JSON.stringify({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                name: ADMIN_NAME,
                address: "System",
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            console.error(`[SeedAdmin] Sign-up failed: ${error}`);
            return;
        }
        await prisma.user.update({
            where: { email: ADMIN_EMAIL },
            data: {
                role: UserRole.ADMIN,
                emailVerified: true,
                isBanned: false,
            },
        });
        console.log("[SeedAdmin] ✅ Admin seeded successfully");
    }
    catch (error) {
        console.error("[SeedAdmin] ❌ Seeding failed:", error);
    }
}
//# sourceMappingURL=seedAdmins.js.map