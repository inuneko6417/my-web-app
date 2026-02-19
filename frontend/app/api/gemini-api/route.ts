import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { prompt_post } = await req.json();
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt_post,
        config: {
          systemInstruction: [
            '渡されたdescriptionの中から、レシピに必要な食材と分量、作り方を抽出してください。',
          ],
        },
      });

    return NextResponse.json({
        response: response.text,
    });
}
