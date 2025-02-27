import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const { libelle, niveau, id_user, id_projet, departement, echeance, datedebut, status, priorite } = await req.json();

    // Vérification des champs requis
    if (!libelle || !niveau || !echeance || !datedebut) {
      return new Response(JSON.stringify({ error: 'Champs requis manquants' }), { status: 400 });
    }

    // Insertion dans la base de données
    const { data, error } = await supabase
      .from('taches')
      .insert([{ libelle, niveau, id_user, id_projet, departement, echeance, datedebut, status, priorite }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
