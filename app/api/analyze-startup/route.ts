import { NextResponse } from 'next/server';
import { generateMockReport } from '@/lib/mockReport';
import { openai, isOpenAIConfigured } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { idea, roastLevel, industry, stage } = await request.json();

    if (!idea || !roastLevel || !industry || !stage) {
      return NextResponse.json(
        { error: 'Missing required parameters: idea, roastLevel, industry, stage' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Determine if we should use Gemini API key (starts with AQ. or AIzaSy)
    const isGeminiKey = apiKey && (apiKey.startsWith('AQ.') || apiKey.startsWith('AIzaSy'));

    const systemPrompt = `You are a brutally honest VC, startup advisor, AI product planner, GTM strategist, and founder coach.
Analyze startup ideas deeply. Be funny, sharp, and direct, but never insult the founder personally. Roast the idea, not the person.
Always provide useful improvements. 
You must analyze the startup details:
- Idea: "${idea}"
- Roast Level: "${roastLevel}"
- Industry: "${industry}"
- Current Stage: "${stage}"

Your response must be a single, valid JSON object conforming exactly to the following typescript interface:
interface StartupReport {
  verdict: string; // A one-line summary / investment committee verdict on the startup
  roast: string; // The funny, direct, sharp roast about the idea. Max 3-4 sentences. Set style according to roastLevel ('mild', 'honest', 'brutal').
  startupScore: number; // Startup score from 0 to 100 (visual circle gauge score)
  strengths: string[]; // 4 core strengths of this business model
  weaknesses: string[]; // 4 strategic weaknesses
  swot: {
    strengths: string[]; // 3-4 items
    weaknesses: string[]; // 3-4 items
    opportunities: string[]; // 3-4 items
    threats: string[]; // 3-4 items
  };
  targetUsers: {
    persona: string; // customer persona name
    painPoint: string; // core pain point they have
    willingnessToPay: string; // "Low" | "Medium" | "High" (with brief rationale)
  }[];
  marketAnalysis: string; // a short paragraph explaining the market dynamics, size, or trends
  competitorRisk: string; // detail on competitor threat level and defensibility
  revenueModel: string[]; // 3 viable monetization channels
  gtmStrategy: {
    positioning: string; // how the product should be framed or positioned
    channels: string[]; // 3 primary customer acquisition channels
    launchPlan: string[]; // 4 steps for the launch horizon
  };
  mvpRoadmap: string[]; // 5-6 features to prioritize for the MVP roadmap
  investorReadinessScore: number; // score from 0.0 to 10.0 (e.g. 6.8)
  redFlags: string[]; // 4 warning flags investors will notice
  improvedIdea: string; // a concrete pivot or improved version of the idea that increases value/defensibility
  sevenDayActionPlan: string[]; // 7 clear steps (Day 1 through Day 7) for immediate execution
}

You must return ONLY the raw JSON string matching this structure. Do not wrap it in markdown formatting or write conversational text.`;

    if (isGeminiKey) {
      console.log('Gemini API key detected. Calling Gemini API...');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `${systemPrompt}\n\nUser request: Analyze this startup idea: "${idea}" in ${industry} industry, currently at the ${stage} stage. Roast intensity: ${roastLevel}.` 
            }]
          }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || response.statusText);
      }

      const text = data.candidates[0].content.parts[0].text;
      const reportJson = JSON.parse(text);
      return NextResponse.json(reportJson);
    }

    // Call OpenAI if configured
    if (isOpenAIConfigured) {
      console.log('OpenAI API key detected. Calling OpenAI API...');
      const response = await openai!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this startup idea: "${idea}" in ${industry} industry, currently at the ${stage} stage. Roast intensity: ${roastLevel}.`
          }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI returned an empty response');
      }

      const reportJson = JSON.parse(content);
      return NextResponse.json(reportJson);
    }

    // Fallback Mock mode if no keys are set
    console.log('No AI keys configured. Running fallback mock analysis.');
    const mockReport = generateMockReport(idea, roastLevel, industry, stage);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate latency
    return NextResponse.json(mockReport);

  } catch (error: any) {
    console.error('Error analyzing startup:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during startup analysis' },
      { status: 500 }
    );
  }
}
