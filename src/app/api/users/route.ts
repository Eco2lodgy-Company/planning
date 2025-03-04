  import { NextResponse } from "next/server";
  import {supabase} from "../../../lib/SupabaseClient";
  export async function GET() {
      try {
        // Récupérer tous les utilisateurs
        const { data, error } = await supabase.from("users").select("*");
    
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
    
        return NextResponse.json(data, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    }