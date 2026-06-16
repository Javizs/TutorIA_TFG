import { NextResponse } from "next/server";
import { getTutorResponse } from "@/lib/tutor/services/tutorChatService";
import { Scenario, Message } from "@/lib/tutor/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const scenario: Scenario = body.scenario;
    const messages: Message[] = body.messages;

    if (!scenario || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing or invalid scenario or messages." },
        { status: 400 }
      );
    }

    const tutorReply = await getTutorResponse(scenario, messages);

    return NextResponse.json({
      reply: tutorReply,
    });
  } catch (error) {
    console.error("Error in /api/tutor:", error);

    return NextResponse.json(
      { error: "Error generating tutor response." },
      { status: 500 }
    );
  }
}