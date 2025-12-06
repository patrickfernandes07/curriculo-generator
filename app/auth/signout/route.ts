import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();

  // Fazer logout
  await supabase.auth.signOut();

  // Redirecionar para home
  return NextResponse.redirect(new URL("/", request.url));
}
