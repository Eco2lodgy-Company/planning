import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("projets")
      .select("status, count:status", { group: "status" });

    if (error) throw error;

    return NextResponse.json({ projectStatus: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
