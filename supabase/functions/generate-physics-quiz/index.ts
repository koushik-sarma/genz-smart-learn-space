import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Generate physics quiz function called:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Reading request body...');
    const { chapterTitle, chapterNotes } = await req.json();
    console.log('Request data:', { chapterTitle, hasNotes: !!chapterNotes });

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('OpenAI API key found, preparing system prompt...');

    const systemPrompt = `You are a Physics quiz generator specialized in creating educational quizzes for ${chapterTitle}.

Chapter Context:
${chapterNotes ? `
Summary: ${chapterNotes.chapter_summary}
Key Discussion Points: ${chapterNotes.chapter_discussion_points}
Important Formulae: ${chapterNotes.chapter_formulae}
Key Takeaways: ${chapterNotes.chapter_takeaways}
` : ''}

Instructions:
- Generate exactly 5 multiple choice questions about ${chapterTitle}
- Each question should have 4 options (A, B, C, D)
- Include a mix of conceptual, numerical, and application-based questions
- Provide clear explanations for the correct answers
- Make questions appropriate for students learning this chapter
- Ensure questions test understanding rather than just memorization

Return your response as a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this is the correct answer"
    }
  ]
}

Make sure the JSON is valid and properly formatted.`;

    const userPrompt = `Generate a physics quiz for the chapter "${chapterTitle}". Focus on the key concepts and ensure the questions are educational and appropriately challenging.`;

    console.log('Making OpenAI API request...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in OpenAI response:', data);
      throw new Error('No content received from OpenAI');
    }

    let quizData;
    try {
      quizData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      console.error('Invalid quiz structure:', quizData);
      throw new Error('Invalid quiz format received');
    }

    console.log('Sending successful response with', quizData.questions.length, 'questions');
    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-physics-quiz function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unknown error occurred',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});