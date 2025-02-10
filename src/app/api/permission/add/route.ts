import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_user, datedebut, datefin, motif, status } = body;

    if (!id_user || !datedebut || !datefin) {
      return NextResponse.json(
        { error: "Les champs 'id_user', 'datedebut' et 'datefin' sont obligatoires." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("permissions").insert({
      id_user,
      datedebut,
      datefin,
      motif,
      status
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
