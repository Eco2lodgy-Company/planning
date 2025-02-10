import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
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
      .delete()
      .eq("id_absence", id_absence);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
