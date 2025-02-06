import {supabase} from "../../../../lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req:Request) {
    try {
      const body = await req.json();
      const { id_user, ...updatedFields } = body;
  
      const { data, error } = await supabase.from("users").update(updatedFields).eq("id_user", id_user);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }