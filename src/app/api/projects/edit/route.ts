import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id_projet, project_name, project_type, partenaire, echeance, chef_projet, status, departement } = body;

    // Mettre à jour le projet dans la base de données
    const { data, error } = await supabase
      .from("projets")
      .update({
        project_name,
        project_type,
        partenaire,
        echeance,
        chef_projet,
        status,
        departement,
      })
      .eq("id_projet", id_projet)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}