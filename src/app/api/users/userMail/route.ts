import { supabase } from "@/lib/SupabaseClient"

export async function POST(req:Request) {
  const { mail, password } = await req.json();

  // Vérification des champs
  if (!mail || !password) {
    return new Response(JSON.stringify({ message: 'Email et mot de passe requis.' }), { status: 400 });
  }

  // Récupération de l'utilisateur
  const { data, error } = await supabase
    .from('users')
    .select('id_user, nom_complet, mail, password,role')
    .eq('mail', mail)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ message: 'Utilisateur non trouvé.' }), { status: 404 });
  }

  // Vérification du mot de passe
  if (password !== data.password) {
    return new Response(JSON.stringify({ message: 'Mot de passe incorrect.' }), { status: 401 });
  }

  // Connexion réussie, on renvoie l'utilisateur
  return new Response(
    JSON.stringify({
      message: 'Connexion réussie.',
      user: {
        role:data.role,
       id_user: data.id_user,
        // nom_complet: data.nom_complet,
        // mail: data.mail,
      },
    }),
    { status: 200 }
  );
}
