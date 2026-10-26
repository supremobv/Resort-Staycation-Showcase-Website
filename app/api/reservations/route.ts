import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { reservations } from "../../../db/schema";
import { rooms, dateError, nightsBetween } from "../../stay-data";
import { getChatGPTUser } from "../../chatgpt-auth";
const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).default(""),
  room: z.enum(["garden", "suite", "villa"]),
  start: z.string(),
  end: z.string(),
  guests: z.number().int().min(1).max(8),
  message: z.string().trim().max(3000).default(""),
  consent: z.literal("on"),
});
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 12000)
    return Response.json({ error: "Inquiry too large." }, { status: 413 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return Response.json(
        { error: "Please check your details, email address, and consent." },
        { status: 400 },
      );
    const { consent, ...data } = parsed.data;
    const problem = dateError(data.start, data.end);
    if (problem) return Response.json({ error: problem }, { status: 400 });
    const room = rooms.find((r) => r.id === data.room)!;
    if (data.guests > room.guests)
      return Response.json(
        { error: "This stay welcomes up to " + room.guests + " guests." },
        { status: 400 },
      );
    const id = crypto.randomUUID();
    const reference = "LAYA-" + id.slice(0, 8).toUpperCase();
    await getDb()
      .insert(reservations)
      .values({
        ...data,
        id,
        reference,
        estimate: room.price * nightsBetween(data.start, data.end),
        status: "New",
        createdAt: Date.now(),
      });
    return Response.json({ saved: true, reference }, { status: 201 });
  } catch {
    return Response.json(
      { error: "We couldn’t save your inquiry. Please try again." },
      { status: 503 },
    );
  }
}
export async function GET() {
  if (!(await getChatGPTUser()))
    return Response.json({ error: "Sign in required." }, { status: 401 });
  try {
    return Response.json(
      await getDb()
        .select()
        .from(reservations)
        .orderBy(desc(reservations.createdAt))
        .limit(500),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Unable to load inquiries." },
      { status: 503 },
    );
  }
}
export async function PATCH(request: Request) {
  if (!(await getChatGPTUser()))
    return Response.json({ error: "Sign in required." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const parsed = z
      .object({
        id: z.string().uuid(),
        status: z.enum(["New", "Contacted", "Closed"]),
      })
      .safeParse(await request.json());
    if (!parsed.success)
      return Response.json(
        { error: "Invalid status update." },
        { status: 400 },
      );
    await getDb()
      .update(reservations)
      .set({ status: parsed.data.status })
      .where(eq(reservations.id, parsed.data.id));
    return Response.json({ saved: true });
  } catch {
    return Response.json(
      { error: "Unable to update inquiry." },
      { status: 503 },
    );
  }
}
