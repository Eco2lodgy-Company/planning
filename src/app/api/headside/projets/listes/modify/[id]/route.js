import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    const { id } = params; 
    const { newStatus } = await req.json(); 

    if (!id || newStatus === undefined) {
        return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    try {
        // ⚡ Mise à jour du projet avec le nouvel état
        const { data, error } = await supabase
            .from("projets")
            .update({ status: newStatus })
            .eq("id_projet", id); // ✅ Correction de la syntaxe

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
