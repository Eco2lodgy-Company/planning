import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_absence } = body;

    if (!id_absence) {
      return NextResponse.json(
        { error: "Le champ 'id_absence' est obligatoire." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("absences")
      .select("*")
      .eq("id_absence", id_absence)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { exists: false, message: "Absence non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json({ exists: true, message: "Absence trouvée." }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
