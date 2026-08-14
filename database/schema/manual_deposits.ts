import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const real_manual_deposits = sqliteTable("real_manual_deposits", {
    id: text("id").primaryKey(),
    deposit_id: text("deposit_id").notNull(),
    user_id: text("user_id").notNull().references(() => users.id),
    amount: real("amount").notNull(),
    asset: text("asset").notNull(),
    payment_reference: text("payment_reference").notNull(),
    transaction_hash: text("transaction_hash"),
    proof_file_url: text("proof_file_url"), 
    remarks: text("remarks"),
    status: text("status", { enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"] }).default("PENDING").notNull(),
    reviewed_by: text("reviewed_by"),
    reviewed_at: integer("reviewed_at", { mode: "timestamp" }),
    rejection_reason: text("rejection_reason"),
    created_at: integer("created_at", { mode: "timestamp" }).notNull(),
    updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});
