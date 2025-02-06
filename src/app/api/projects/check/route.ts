import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_projet } = body;

    if (!id_projet) {
      return NextResponse.json(
        { error: "Le champ 'id_projet' est obligatoire." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("projets")
      .select("id_projet")
      .eq("id_projet", id_projet)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { exists: false, message: "Projet non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ exists: true, message: "Projet trouvé." }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
