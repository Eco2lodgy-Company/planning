import { equal } from "assert";
import { supabase } from "../../../../lib/SupabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const { data, error } = await supabase
      .from("users").select("*");
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }