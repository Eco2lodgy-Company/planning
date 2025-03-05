import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("logs")
      .select("user", { count: "exact" })
      .gte("login_time", `${today}T00:00:00`)
      .lte("login_time", `${today}T23:59:59`);

    if (error) throw error;

    return NextResponse.json({ activeUsers: data.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
