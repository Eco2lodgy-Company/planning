import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(req:Request) {
  try {
    const body = await req.json();
    const { id_p, datedebut, datefin, motif, status } = body;

    if (!id_p) {
      return NextResponse.json({ error: "Le champ 'id_p' est obligatoire." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("permissions")
      .update({ datedebut, datefin, motif, status })
      .eq("id_p", id_p);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
