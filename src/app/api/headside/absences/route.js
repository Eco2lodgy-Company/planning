import {supabase} from "@/lib/SupabaseClient";
import {NextResponse} from "next/server";


export async function POST(request) {
    try {
        const {employe, date, raison} = await request.json();

        // Vérification des données
        if (!employe || !date || !raison) {
            return NextResponse.json(
                {message: "Tous les champs sont requis"},
                {status: 400}
            );
        }


        // Insertion des données dans la table "retard"
        const {data, error} = await supabase
            .from("absences")
            .insert([{id_user: employe, date_absence: date, motif: raison}]);

        if (error) {
            return NextResponse.json({message: error.message}, {status: 500});
        }

        // Renvoie une réponse avec les données insérées
        return NextResponse.json(data, {status: 200});
    } catch (error) {
        //console.log(error.message);
        return NextResponse.json({message: "Erreur lors de l'ajout du l'absence"}, {status: 500});
    }
}

export async function GET() {
    try {
        const {data, error} = await supabase
            .from("absences").select("*");

        if (error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json(data, {status: 200});
    } catch (err) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}