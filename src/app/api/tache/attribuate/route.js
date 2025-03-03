import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";


export async function PUT() {
    try {
        
        const { id_user,datedebut,id_tache } = await req.json();

        if (!id_user || !datedebut || !id_tache) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        // Mise à jour de la permission dans Supabase
        const { data, error } = await supabase
            .from("tache") // Remplace par le nom de ta table
            .update({ id_user: id_user,datedebut:datedebut })
            .eq("id_tache", id_tache)
            .select(); // Récupère la ligne mise à jour

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ message: "permission mise à jour", task: data[0] });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
    }
}
