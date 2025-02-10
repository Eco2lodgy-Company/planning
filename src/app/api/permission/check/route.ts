import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_user, datedebut, datefin } = body;

    if (!id_user || !datedebut || !datefin) {
      return NextResponse.json({ error: "Les champs 'id_user', 'datedebut' et 'datefin' sont obligatoires." }, { status: 400 });
    }

    // Vérifier si la permission existe pour l'utilisateur dans la plage de dates
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .eq("id_user", id_user)
      .gte("datedebut", datedebut)
      .lte("datefin", datefin);

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
