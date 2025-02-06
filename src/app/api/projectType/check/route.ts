import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/SupabaseClient";



export async function POST(req:Request) {
  try {
    // Lire le corps de la requête
    const body = await req.json();
    const { id_type } = body;

    if (!id_type) {
      return NextResponse.json(
        { error: "Le champ 'id_type' est obligatoire." },
        { status: 400 }
      );
    }

    // Rechercher le type correspondant
    const { data, error } = await supabase
      .from("typeprojet")
      .select("*")
      .eq("id_type", id_type)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Aucun type trouvé avec cet ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 },);
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
