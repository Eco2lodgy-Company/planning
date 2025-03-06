import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("taches")
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Désactiver le cache HTTP pour éviter les données obsolètes
    return new NextResponse(
      JSON.stringify({ data }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
