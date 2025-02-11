// src/app/api/headside/retards/route.js
import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { employe, date, minutes, motif } = await request.json();

    // Vérification des données
    if (!employe || !date || !minutes || !motif) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    console.log(employe, date, minutes, motif);
    let id_user=employe;
    let date_retard = date;
    let temps = minutes;
    // Insertion des données dans la table "retard"
    const { data, error } = await supabase
      .from("retard")
      .insert([{ id_user, date_retard, motif, temps }]);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Renvoie une réponse avec les données insérées
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    //console.log(error.message);
    return NextResponse.json({ message: "Erreur lors de l'ajout du retard" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const { data, error } = await supabase
    .rpc('get_retards');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}