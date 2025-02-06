import {supabase} from "../../../../lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
    try {
      const body = await req.json();
      const { id_user } = body;
  
      const { data, error } = await supabase.from("users").delete().eq("id_user", id_user);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json({ message: "Utilisateur supprimé avec succès" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }