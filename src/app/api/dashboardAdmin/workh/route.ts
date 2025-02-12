import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.from("logs").select("login_time, logoutTime");

    if (error) throw error;

    const totalHours = data.reduce((sum, log) => {
      const loginTime = new Date(log.login_time);
      const logoutTime = new Date(`${loginTime.toISOString().split("T")[0]}T${log.logoutTime}`);
      const hoursWorked = (logoutTime - loginTime) / (1000 * 60 * 60); // Conversion en heures
      return sum + hoursWorked;
    }, 0);

    return NextResponse.json({ totalHours: totalHours.toFixed(2) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
