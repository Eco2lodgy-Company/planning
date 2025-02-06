import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
    try {
      const body = await req.json();
      const { id_projet } = body;
  
      const { data, error } = await supabase.from("projets").delete().eq("id_projet", id_projet);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json({ message: "Projet supprimé avec succès" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }