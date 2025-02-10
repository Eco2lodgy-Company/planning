import { supabase } from "../../../../lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const userId = params.userId; // 🔥 Vérifie que userId est bien récupéré

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id_user", userId)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
