import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        admin: "admin";
        manager: "manager";
        user: "user";
    }>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare function register(input: unknown): Promise<{
    user: {
        email: string;
        role: import("@prisma/client").$Enums.Role;
        id: string;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function login(input: unknown): Promise<{
    user: {
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare function refresh(input: unknown): Promise<{
    accessToken: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map