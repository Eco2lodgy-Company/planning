import { supabase } from "@/lib/SupabaseClient";

export async function POST(req: Request) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(JSON.stringify({ message: 'Erreur lors de la déconnexion.' }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ message: 'Déconnexion réussie.' }),
    { status: 200 }
  );
}
