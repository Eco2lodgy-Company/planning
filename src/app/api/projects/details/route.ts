import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
  try {
    // Extraire les paramètres de requête
    const { searchParams } = new URL(req.url);
    const id_projet = searchParams.get("id");

    let { data, error } = id_projet
      ? await supabase.rpc("get_project_details").eq("id_projet", id_projet)
      : await supabase.rpc("get_project_details");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
