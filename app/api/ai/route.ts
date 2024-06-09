import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
    });

    const theResponse = completion.choices[0].message;

    return NextResponse.json({ output: theResponse }, { status: 200 });
  } catch (error) {
    console.error("Error creating completion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
