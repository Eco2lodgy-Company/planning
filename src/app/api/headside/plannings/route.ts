import { supabase } from "@/lib/SupabaseClient"

export async function POST(req:Request) {
  const { id_user } = await req.json();

  // Vérification des champs
  if (!id_user) {
    return new Response(JSON.stringify({ message: 'id est requis.' }), { status: 400 });
  }

  // Récupération de l'utilisateur
  const { data, error } = await supabase
    .from('users')
    .select('id_user, nom_complet')
    .eq('id_user', id_user)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ message: 'Utilisateur non trouvé.' }), { status: 404 });
  }



  // Connexion réussie, on renvoie l'utilisateur
  return new Response(
    JSON.stringify({
      message: 'Connexion réussie.',
      user: {
       id_user: data.id_user,
       nom_complet: data.nom_complet,
        // mail: data.mail,
      },
    }),
    { status: 200 }
  );
}
