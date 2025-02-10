import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { titre } = body;

    if (!titre) {
      return NextResponse.json({ error: "Le champ 'titre' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase.from("departement").insert({ titre });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
