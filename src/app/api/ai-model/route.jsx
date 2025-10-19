import { QUESTION_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async (request) => {
  try {
    // ✅ Correctly parse the request body
    const { jobPosition, jobDescription, duration, type } = await request.json();

    // ✅ Build the final prompt
    const FINAL_PROMPT = QUESTION_PROMPT
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{jobTitle}}", jobPosition)
      .replace("{{duration}}", duration)
      .replace("{{type}}", type);

    console.log("🧠 Final Prompt:", FINAL_PROMPT);

    // ✅ Initialize OpenAI (OpenRouter) client
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // ✅ Generate questions
    const completion = await openai.chat.completions.create({
      // ! Model Name
      model: "nvidia/nemotron-nano-9b-v2:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const message = completion.choices[0]?.message?.content || "No response received";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("❌ AI generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
