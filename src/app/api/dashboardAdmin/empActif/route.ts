import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    // Use a subquery to get the first login for each user today
    const { data, error } = await supabase
      .from("logs")
      .select("user", { count: "exact" })
      .eq(
        "id", 
        supabase
          .from("logs")
          .select("id")
          .gte("login_time", `${today}T00:00:00`)
          .lte("login_time", `${today}T23:59:59`)
          .order("login_time", { ascending: true })
          .group("user")
          .select("id")
      );

    if (error) throw error;

    return NextResponse.json({ activeUsers: data.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
