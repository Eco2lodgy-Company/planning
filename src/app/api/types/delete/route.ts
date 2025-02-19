import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Le champ 'id' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase.from("typeprojet").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "type supprimé avec succès." }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
