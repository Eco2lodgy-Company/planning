import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
  try {
    const body = await req.json();
    const { id_p } = body;

    if (!id_p) {
      return NextResponse.json({ error: "Le champ 'id_p' est obligatoire." }, { status: 400 });
    }

    // Vérifier si la permission existe
    const { data, error: checkError } = await supabase
      .from("permissions")
      .select("*")
      .eq("id_p", id_p);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 400 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Permission non trouvée." }, { status: 404 });
    }

    // Supprimer la permission si elle existe
    const { error } = await supabase.from("permissions").delete().eq("id_p", id_p);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Permission supprimée avec succès." }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
