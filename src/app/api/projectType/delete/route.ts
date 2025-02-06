import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id_type = searchParams.get("id_type");
  
      if (!id_type) {
        return NextResponse.json(
          { error: "Le champ 'id_type' est obligatoire." },
          { status: 400 }
        );
      }
  
      const { data, error } = await supabase
        .from("typeprojet")
        .delete()
        .eq("id_type", id_type);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
  