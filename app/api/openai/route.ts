import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import config from '@/config';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log('Received prompt:', prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: prompt.model,
      temperature: prompt.temperature,
      messages: [
        { role: "system", content: prompt.systemPrompt },
        { role: "user", content: prompt.userPrompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;
    console.log('OpenAI API response:', result);
    return NextResponse.json({ result: result ? JSON.parse(result) : null });
  } catch (error: any) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate response', details: error.message }, { status: 500 });
  }
}