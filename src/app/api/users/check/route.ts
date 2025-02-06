import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(req:Request) {
    try {
      const body = await req.json();
      const { mail, password } = body;
  
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("mail", mail)
        .eq("password", password)
        .single();
  
      if (error) {
        return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
      }
  
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }