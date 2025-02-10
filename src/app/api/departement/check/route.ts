import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { titre } = body;

    if (!titre) {
      return NextResponse.json({ error: "Le champ 'titre' est obligatoire." }, { status: 400 });
    }

    // Vérifier l'existence du département en fonction du 'titre'
    const { data, error } = await supabase
      .from("departement")
      .select("*")
      .eq("titre", titre);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.length === 0) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }

    return NextResponse.json({ exists: true, data }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
