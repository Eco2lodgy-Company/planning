import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";


export async function PUT(req, { params }) {
    try {
        const { leaveId } = params;
        const { status,rejectMotif } = await req.json();

        if (!leaveId || !status) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        console.log("leaveId",leaveId);
        console.log("status",status);
        console.log("rejectMotif",rejectMotif);

        // Mise à jour de la permission dans Supabase
        const { data, error } = await supabase
            .from("permissions") // Remplace par le nom de ta table
            .update({ status:status,motif_rejet:rejectMotif })
            .eq("id_p", leaveId)
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
