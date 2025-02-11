import { supabase } from "@/lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const userId = params.userId; //Vérifie que userId est bien récupéré

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .rpc('get_absences_by_resp', {resp_id: userId});

        if (error) {
            console.log(error.message);

            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.log(err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
