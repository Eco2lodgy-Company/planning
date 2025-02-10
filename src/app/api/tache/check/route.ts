import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_tache } = body;

    if (!id_tache) {
      return NextResponse.json({ error: "Le champ 'id_tache' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("taches")
      .select("*")
      .eq("id_tache", id_tache);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Tâche non trouvée." }, { status: 404 });
    }

    return NextResponse.json({ message: "Tâche trouvée." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
