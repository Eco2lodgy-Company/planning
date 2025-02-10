import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id_tache } = body;

    if (!id_tache) {
      return NextResponse.json({ error: "Le champ 'id_tache' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("taches")
      .delete()
      .eq("id_tache", id_tache)
      .select(); // Assurez-vous que les données supprimées sont renvoyées.

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Vérifiez si la suppression a effectivement eu lieu
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Tâche non trouvée ou déjà supprimée." }, { status: 404 });
    }

    return NextResponse.json({ message: "Tâche supprimée.", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
