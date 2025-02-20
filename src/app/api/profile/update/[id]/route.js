import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { email, password } = await req.json();

        if (!id || !email || !password) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        // Mise à jour de l'email et du mot de passe dans la table users
        const { data, error: profileError } = await supabase
            .from("users") // Utilise la table users
            .update({ mail: email, password: password })
            .eq("id_user", id) // Utilise le bon identifiant
            .select(); // Récupère la ligne mise à jour

        if (profileError) {
            throw new Error(profileError.message);
        }

        return NextResponse.json({ message: "Profil mis à jour", profile: data[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
    }
}
