import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_user } = body;

    if (!id_user) {
      return NextResponse.json(
        { error: "Le champ 'id_user' est obligatoire." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("id_user")
      .eq("id_user", id_user)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { exists: false, message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({ exists: true, message: "Utilisateur trouvé." }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
