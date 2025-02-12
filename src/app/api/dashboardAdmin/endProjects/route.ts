import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const { count, error } = await supabase
      .from("projets")
      .select("id_projet", { count: "exact", head: true })
      .eq("status", "done");

    if (error) throw error;

    return NextResponse.json({ completedProjects: count });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
