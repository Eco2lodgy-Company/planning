import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { id_user, date_absence, motif } = body;

    if (!date_absence || !motif) {
      return NextResponse.json(
        { error: "Les champs 'date_absence' et 'motif' sont obligatoires." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("absences")
      .insert([{ id_user, date_absence, motif }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
