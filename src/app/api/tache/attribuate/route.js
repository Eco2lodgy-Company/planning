import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function PUT(req) {
  try {
    const { id_user, datedebut, id_tache } = await req.json();

    // Validation plus stricte des entrées
    if (!id_user || !datedebut || !id_tache) {
      console.log("Données manquantes : ", { id_user, datedebut, id_tache });
      return NextResponse.json(
        { error: "Tous les champs (id_user, datedebut, id_tache) sont requis" },
        { status: 400 }
      );
    }

    // Validation des types
    if (isNaN(id_user) || isNaN(id_tache)) {
      return NextResponse.json(
        { error: "id_user et id_tache doivent être des nombres" },
        { status: 400 }
      );
    }

    // Vérification du format de la date
    const isValidDate = !isNaN(Date.parse(datedebut));
    if (!isValidDate) {
      return NextResponse.json(
        { error: "datedebut doit être une date valide au format YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Mise à jour de la tâche dans Supabase
    const { data, error } = await supabase
      .from("taches")
      .update({ id_user: Number(id_user), datedebut })
      .eq("id_tache", Number(id_tache))
      .select()
      .single(); // Utilisez .single() pour garantir une seule ligne

    if (error) {
      console.error("Erreur Supabase :", error);
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json(
        { error: "Aucune tâche trouvée avec cet id_tache" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Tâche assignée avec succès",
      task: data, // Retourne la tâche complète mise à jour
    }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}