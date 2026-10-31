import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  if (!supabase) return Response.json({ status: "missing" });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ status: "missing" }, { status: 401 });

  const { data } = await supabase
    .from("orders")
    .select("status, number, failure_reason")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  return Response.json(data ?? { status: "missing" });
}
