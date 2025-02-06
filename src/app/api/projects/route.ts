import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id_projet = searchParams.get("id");

    const { data, error } = id_projet
      ? await supabase.from("projets").select("*").eq("id_projet", id_projet).single()
      : await supabase.from("projets").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}








