import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    // Récupérer le count des utilisateurs
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ totalUsers: count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
