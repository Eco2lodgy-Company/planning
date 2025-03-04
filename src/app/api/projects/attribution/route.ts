import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";


export async function PUT(req:Request) {
    try {
        
        const { chef_projet,datedebut,id_projet } = await req.json();

        if (!chef_projet || !datedebut || !id_projet) {
            console.log("chef_projet",chef_projet)
            console.log("datedebut",datedebut)
            console.log("id_projet",id_projet)
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        // Mise à jour de la permission dans Supabase
        const { data, error } = await supabase
            .from("projets") // Remplace par le nom de ta table
            .update({ chef_projet: chef_projet,datedebut:datedebut })
            .eq("id_projet", id_projet)
            .select(); // Récupère la ligne mise à jour

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ message: "permission mise à jour", task: data[0] });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Erreur serveur", details: (error as Error).message }, { status: 500 });
    }
}
