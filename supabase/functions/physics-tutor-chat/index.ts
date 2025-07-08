import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Physics tutor chat function called:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Reading request body...');
    const { message, chapterTitle, chapterNotes } = await req.json();
    console.log('Request data:', { message, chapterTitle, hasNotes: !!chapterNotes });

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('OpenAI API key found, preparing system prompt...');

    const systemPrompt = `You are a Physics tutor specialized in helping students understand ${chapterTitle}. 

Chapter Context:
${chapterNotes ? `
Summary: ${chapterNotes.chapter_summary}
Key Discussion Points: ${chapterNotes.chapter_discussion_points}
Important Formulae: ${chapterNotes.chapter_formulae}
Key Takeaways: ${chapterNotes.chapter_takeaways}
` : ''}

Guidelines:
- Answer questions clearly and concisely
- Use simple language appropriate for students
- Provide step-by-step explanations when needed
- Reference the chapter content when relevant
- If asked about formulas, explain them clearly
- Encourage deeper understanding through follow-up questions
- Stay focused on the chapter topic: ${chapterTitle}`;

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
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
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
    
    const reply = data.choices?.[0]?.message?.content;
    
    if (!reply) {
      console.error('No reply in OpenAI response:', data);
      throw new Error('No reply received from OpenAI');
    }

    console.log('Sending successful response');
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in physics-tutor-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unknown error occurred',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});