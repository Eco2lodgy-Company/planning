import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { libelle, niveau, id_user, id_projet, departement, echeance, datedebut, status } = body;

    if (!libelle || !niveau || !id_user || !id_projet || !echeance || !datedebut) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("taches")
      .insert([{ libelle, niveau, id_user, id_projet, departement, echeance, datedebut, status }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
