import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.rpc("workload_evolution"); // Supposons que vous utilisez une fonction SQL

    if (error) throw error;

    return NextResponse.json({ workloadEvolution: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
