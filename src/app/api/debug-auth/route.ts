import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json({ step: "auth", error: authError.message, user: null });
    }

    if (!user) {
      return NextResponse.json({ step: "auth", error: "No authenticated user found", user: null });
    }

    // Auth is OK, check Prisma
    let prismaUser = null;
    let prismaError = null;
    try {
      prismaUser = await prisma.user.findUnique({ where: { id: user.id } });
    } catch (e: any) {
      prismaError = e.message;
    }

    return NextResponse.json({
      step: "complete",
      authUser: { id: user.id, email: user.email },
      prismaUser,
      prismaError,
    });
  } catch (e: any) {
    return NextResponse.json({ step: "crash", error: e.message });
  }
}
