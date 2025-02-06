import { NextResponse } from "next/server";
import {supabase} from "../../../../lib/SupabaseClient";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { matricule, nom_complet, nationality, genre, tel, mail, adresse, departement, poste, password, role } = body;
  
      const { data, error } = await supabase.from("users").insert([
        { matricule, nom_complet, nationality, genre, tel, mail, adresse, departement, poste, password, role },
      ]);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }