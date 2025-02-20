import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";


export async function PUT(req, { params }) {
    try {
        const { taskId } = params;
        const { status } = await req.json();

        if (!taskId || !status) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        // Mise à jour de la tâche dans Supabase
        const { data, error } = await supabase
            .from("taches") // Remplace par le nom de ta table
            .update({ status })
            .eq("id_tache", taskId)
            .select(); // Récupère la ligne mise à jour

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ message: "Tâche mise à jour", task: data[0] });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
    }
}
