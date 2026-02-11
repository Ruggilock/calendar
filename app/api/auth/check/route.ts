import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("auth_session");

  if (session?.value === "authenticated") {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}
