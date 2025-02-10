import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(req:Request) {
  try {
    const body = await req.json();
    const { id_tache, ...updates } = body;

    if (!id_tache) {
      return NextResponse.json({ error: "Le champ 'id_tache' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("taches")
      .update(updates)
      .eq("id_tache", id_tache);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
