
import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
      const { motif,datedebut,datefin,type,id_user } = await request.json();
  
      // Vérification des données
      if (!motif || !datedebut || !datefin || !type || !id_user) {
        return NextResponse.json(
          { message: "Tous les champs sont requis" },
          console.log(motif,datedebut,datefin,type,id_user),
          { status: 400 }
        );
      }
  
      // Insertion des données dans la table "retard"
      const { data, error } = await supabase
        .from("permissions")
        .insert([{ id_user:id_user, datedebut:datedebut, datefin:datefin,type:type,motif:motif }]);
  
      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
  
      // Renvoie une réponse avec les données insérées
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      //console.log(error.message);
      return NextResponse.json({ message: "Erreur lors de l'enregistrement de la permission" }, { status: 500 });
    }
  }