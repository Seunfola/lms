import { NextResponse } from "next/server";
import OpenAI from "openai";

const configureOpenAI = (apiKey: string, organization: string | null = null, project: string | null = null) => {
  return new OpenAI({
    apiKey,
    organization,
    project,
    baseURL: 'https://api.openai.com/v1'
  });
};

interface ChatCompletionMessageParam {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

interface RequestBody {
  messages: ChatCompletionMessageParam[];
  organization?: string | null;
  project?: string | null;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const openai = configureOpenAI(apiKey, body.organization, body.project);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
    });

    const theResponse = completion.choices[0].message;

    return NextResponse.json({ output: theResponse }, { status: 200 });
  } catch (error) {
    if (error === 'insufficient_quota') {
      const responseData = error;
      console.error("Response data:", responseData);
      return NextResponse.json({ error: "Insufficient quota. Please check your OpenAI plan and usage." }, { status: 403 });
    }
    console.error("Error creating completion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
