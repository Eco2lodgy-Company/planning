import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { id_user } = await request.json();

    if (!id_user) {
      return NextResponse.json(
        { message: "Erreur : ID utilisateur non trouvé" },
        { status: 400 }
      );
    }

    console.log("Utilisateur reçu:", id_user);

    // Insertion des logs
    const { data, error } = await supabase
      .from("logs")
      .insert([{ user: id_user }]);

    if (error) {
      console.error("Erreur lors de l'insertion dans Supabase:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout aux logs", details: error.message },
      { status: 500 }
    );
  }
}
