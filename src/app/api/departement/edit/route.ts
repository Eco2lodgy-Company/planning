import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(req:Request) {
  try {
    const body = await req.json();
    const { id, titre } = body;

    if (!id) {
      return NextResponse.json({ error: "Le champ 'id' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("departement")
      .update({ titre })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
