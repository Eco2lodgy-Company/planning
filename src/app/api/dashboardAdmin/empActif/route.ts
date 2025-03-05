import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("logs")
      .select("user")
      .gte("login_time", `${today}T00:00:00`)
      .lte("login_time", `${today}T23:59:59`)
      .order("login_time", { ascending: true })
      .then(async (result) => {
        if (result.error) throw result.error;
        // Obtenir les utilisateurs uniques en filtrant les duplicatas côté client
        const uniqueUsers = new Set(result.data.map(item => item.user));
        return { data: uniqueUsers.size, error: null };
      });

    if (error) throw error;

    return NextResponse.json({ activeUsers: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}