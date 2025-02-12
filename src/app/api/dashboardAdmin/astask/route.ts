import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const { count, error } = await supabase
      .from("taches")
      .select("id_tache", { count: "exact", head: true })
      .not("id_user", "is", null);

    if (error) throw error;

    return NextResponse.json({ assignedTasks: count });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
