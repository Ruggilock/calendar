import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Auth not configured" },
      { status: 500 }
    );
  }

  if (username === validUsername && password === validPassword) {
    const response = NextResponse.json({ success: true });

    response.cookies.set("auth_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  }

  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  );
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth_session");
  return response;
}
