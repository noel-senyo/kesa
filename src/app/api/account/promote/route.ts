import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/** Promotes ADMIN_EMAIL to the admin role after that person signs in. */
export async function POST() {
  const supabase = await createClient();
  if (!supabase) return Response.json({ role: "customer" });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const expected = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!user?.email || !expected || user.email.toLowerCase() !== expected) {
    return Response.json({ role: "customer" });
  }

  const service = createServiceClient();
  if (!service) return Response.json({ role: "customer" });
  await service.from("profiles").update({ role: "admin", email: user.email }).eq("id", user.id);
  return Response.json({ role: "admin" });
}
