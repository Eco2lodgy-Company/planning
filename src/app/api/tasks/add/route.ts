import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const {
      libelle,
      niveau,
      id_user,
      id_projet,
      echeance,
      datedebut,
      status = "pending",
      departement = 5,
      priorite = 1,
    } = body;

    // Validation des données obligatoires
    if (!libelle || !niveau || !echeance || !datedebut) {
      return NextResponse.json(
        { error: "Les champs libelle, niveau, echeance, et datedebut sont obligatoires." },
        { status: 400 }
      );
    }

    // Insérer la tâche dans la table `taches`
    const { data, error } = await supabase.from("taches").insert([
      {
        libelle,
        niveau,
        id_user,
        id_projet,
        echeance,
        datedebut,
        status,
        departement,
        priorite,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
