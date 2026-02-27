import { z } from "zod";
export declare const createTicketSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    assigneeId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTicketSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    assigneeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        resolved: "resolved";
        closed: "closed";
    }>;
}, z.core.$strip>;
export declare function assertTransition(from: string, to: string): void;
export declare function listTickets(params: {
    q?: string;
    status?: any;
    assigneeId?: string;
    page: number;
    limit: number;
}): Promise<{
    items: ({
        createdBy: {
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        };
        assignee: {
            email: string;
            role: import("@prisma/client").$Enums.Role;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        assigneeId: string | null;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdById: string;
    })[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
//# sourceMappingURL=tickets.service.d.ts.map