import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req:Request) {
    try {
      const body = await req.json();
      const { id_type, type } = body;
  
      if (!id_type || !type) {
        return NextResponse.json(
          { error: "Les champs 'id_type' et 'type' sont obligatoires." },
          { status: 400 }
        );
      }
  
      const { data, error } = await supabase
        .from("typeprojet")
        .update({ type })
        .eq("id_type", id_type);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
  