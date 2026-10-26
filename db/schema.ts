import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const reservations = sqliteTable("reservation_inquiries", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  room: text("room").notNull(),
  start: text("start").notNull(),
  end: text("end").notNull(),
  guests: integer("guests").notNull(),
  message: text("message").notNull(),
  estimate: integer("estimate").notNull(),
  status: text("status").notNull().default("New"),
  createdAt: integer("created_at").notNull(),
});
