// src/app/api/rapport/route.js
import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { user_name, date, temps, taches, blockage, solution, created_at } = await request.json();

    // Vérification des données
    if (!user_name || !date || !taches) {
      return NextResponse.json(
        { message: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Insertion des données dans la table "rapport"
    const { data, error } = await supabase
      .from("rapport")
      .insert([{ userId:user_name, date, temps, taches, blockage, solution, created_at }]);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Renvoie une réponse avec les données insérées
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de l'ajout du rapport" }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const { data, error } = await supabase.from("rapport").select("*");

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
