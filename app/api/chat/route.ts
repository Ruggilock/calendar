import { NextRequest, NextResponse } from "next/server";
import { getSessionRecommendations } from "@/app/services/gemini";

export async function POST(request: NextRequest) {
  try {
    const { message, scheduleData } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await getSessionRecommendations(message, scheduleData);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
