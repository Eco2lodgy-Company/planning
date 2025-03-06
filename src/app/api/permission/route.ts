import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.rpc("get_all_permissions");

    if (error) {
      console.error("Erreur lors de l'exécution de la RPC :", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "Aucune donnée trouvée." }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Erreur serveur :", err);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
