import { supabase } from "@/lib/SupabaseClient"

export async function POST(req:Request) {
  const { id } = await req.json();

  // Vérification des champs
  if (!id) {
    return new Response(JSON.stringify({ message: 'id est requis.' }), { status: 400 });
  }

  // Récupération du departement
  const { data, error } = await supabase
    .from('departement')
    .select('id, titre')
    .eq('id', id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ message: 'departement non trouvé.' }), { status: 404 });
  }



  // Connexion réussie, on le departement
  return new Response(
    JSON.stringify({
      message: 'Connexion réussie.',
      departement: {
       id: data.id,
       titre: data.titre,
        // mail: data.mail,
      },
    }),
    { status: 200 }
  );
}
