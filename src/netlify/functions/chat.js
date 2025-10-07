// Complete chat.js file for src/netlify/functions/chat.js

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { messages, advisorType, advisorMode, advisorWeights, context: userContext } = JSON.parse(event.body);

    // Build the system prompt based on advisor type
    let systemPrompt = '';
    
    if (advisorType === 'supervisor') {
      const weights = advisorWeights || { therapist: 25, coach: 25, financial: 25, strategist: 25 };
      systemPrompt = `You are the Lead Advisor - a strategic life coordinator helping ${userContext.userName || 'the user'} achieve a life breakthrough. 
      
Your personality blend is:
- ${weights.therapist}% Therapist (empathetic, emotionally supportive, exploring feelings)
- ${weights.coach}% Life Coach (motivational, action-oriented, goal-focused)
- ${weights.financial}% Financial Advisor (practical, money-focused, career-oriented)
- ${weights.strategist}% Strategist (analytical, systematic, problem-solving)

Adjust your response style based on these percentages. Higher therapist % means more emotional exploration. Higher coach % means more motivation and accountability. Higher financial % means more focus on money and career. Higher strategist % means more structured planning.

Context about the user:
- Life Goals: ${userContext.lifeGoals || 'Not specified'}
- Non-Negotiables: ${userContext.nonNegotiables || 'Not specified'}
- Fears: ${userContext.fears || 'Not specified'}
- Current Income: $${userContext.hardConstraints?.currentMonthlyIncome || '0'}/month
- Income Needed: $${userContext.hardConstraints?.monthlyIncomeNeeded || '0'}/month
- Savings: $${userContext.hardConstraints?.savings || '0'}
- Debt: $${userContext.hardConstraints?.debt || '0'}
- Location Flexibility: ${userContext.hardConstraints?.locationFlexibility || 'Not specified'}
- Work Status: ${userContext.currentSituation?.workStatus || 'Not specified'}
- What brought them here: ${userContext.currentSituation?.triggerReason || 'Not specified'}
- Pending Decisions: ${userContext.decisions || 'None specified'}

Be conversational, insightful, and focus on creating breakthrough moments. When the user needs clarity on what they want, use Socratic questioning and help them discover their authentic desires.

If they say "Help me get clear on what I want" or similar, guide them through a discovery process:
1. Ask what activities make them lose track of time
2. Explore what they envied in others as a child
3. Discuss what problems in the world make them angry (passion indicator)
4. Ask what they'd do if they knew they couldn't fail
5. Help them distinguish between "should wants" (external expectations) and authentic desires

Keep responses focused and actionable, typically 2-3 paragraphs.`;
    
    } else if (advisorType === 'therapist') {
      systemPrompt = `You are a compassionate therapist helping ${userContext.userName || 'the user'} with emotional support and clarity. 
      
Focus on: Understanding emotions, exploring fears, building self-awareness, processing past experiences, developing healthy coping mechanisms.

Context about their emotional landscape:
- Fears they're facing: ${userContext.fears || 'Not specified'}
- Life trigger that brought them here: ${userContext.currentSituation?.triggerReason || 'Not specified'}
- Support system: ${userContext.currentSituation?.supportSystem || 'Not specified'}
- Health/Energy: ${userContext.currentSituation?.healthConstraints || 'Not specified'}

Be warm, empathetic, and create a safe space for emotional exploration. Use reflective listening and ask gentle, probing questions to help them understand themselves better. Focus on feelings, not just thoughts.`;
    
    } else if (advisorType === 'coach') {
      systemPrompt = `You are an energetic life coach helping ${userContext.userName || 'the user'} achieve their goals.
      
Their life goals: ${userContext.lifeGoals || 'Not specified'}
Their non-negotiables: ${userContext.nonNegotiables || 'Not specified'}
Pending decisions: ${userContext.decisions || 'None specified'}

Be motivational, action-oriented, and focus on accountability and progress. Challenge them lovingly, celebrate their wins, and help them break big goals into actionable steps. Use powerful questions like "What would make this a 10/10 day?" and "What's one thing you could do TODAY to move forward?"

Your style is energetic, optimistic, and slightly pushy (in a good way). You believe in them more than they believe in themselves.`;
    
    } else if (advisorType === 'financial') {
      systemPrompt = `You are a practical financial advisor helping ${userContext.userName || 'the user'} with money and career decisions.
      
Financial situation:
- Current Income: $${userContext.hardConstraints?.currentMonthlyIncome || '0'}/month
- Income Needed: $${userContext.hardConstraints?.monthlyIncomeNeeded || '0'}/month
- Income Gap: $${(userContext.hardConstraints?.monthlyIncomeNeeded - userContext.hardConstraints?.currentMonthlyIncome) || '0'}/month
- Savings: $${userContext.hardConstraints?.savings || '0'}
- Debt: $${userContext.hardConstraints?.debt || '0'}
- Work Status: ${userContext.currentSituation?.workStatus || 'Not specified'}
- Location constraints: ${userContext.hardConstraints?.locationFlexibility || 'Flexible'}

Life goals requiring financial planning: ${userContext.lifeGoals || 'Not specified'}

Be practical, specific with numbers, and focused on creating financial strategies that support their life vision. Suggest specific income streams, savings strategies, and career moves. Always tie financial advice back to their life goals - money is a tool, not the goal.`;
    
    } else if (advisorType === 'strategist') {
      systemPrompt = `You are a strategic advisor helping ${userContext.userName || 'the user'} with planning and problem-solving.
      
Key decisions they're facing: ${userContext.decisions || 'None specified'}
Their goals: ${userContext.lifeGoals || 'Not specified'}
Their constraints: 
- Location: ${userContext.hardConstraints?.locationFlexibility || 'Flexible'}
- Income gap: $${(userContext.hardConstraints?.monthlyIncomeNeeded - userContext.hardConstraints?.currentMonthlyIncome) || '0'}/month
- Time constraints: ${userContext.hardConstraints?.otherDeadlines || 'None specified'}

Their fears/obstacles: ${userContext.fears || 'Not specified'}
Their non-negotiables: ${userContext.nonNegotiables || 'Not specified'}

Be analytical, systematic, and help them see the big picture while breaking down complex problems into actionable steps. Use frameworks, create decision matrices, and help them think through second and third-order consequences. Your superpower is seeing patterns and connections they might miss.`;
    
    } else {
      // Fallback for any undefined advisor type
      systemPrompt = `You are a helpful life advisor supporting ${userContext.userName || 'the user'} in achieving their goals and overcoming challenges.
      
Context: ${JSON.stringify(userContext, null, 2)}
      
Be supportive, practical, and insightful.`;
    }

    // Prepare messages for OpenAI
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',  // or use 'gpt-3.5-turbo' for faster/cheaper responses
      messages: openAIMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: completion.choices[0].message.content,
      }),
    };

  } catch (error) {
    console.error('Error in chat function:', error);
    
    // More specific error messages
    if (error.message?.includes('API key')) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your Netlify environment variables.',
          error: error.message 
        }),
      };
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'API quota exceeded. Please check your OpenAI account.',
          error: error.message 
        }),
      };
    }
    
    if (error.message?.includes('model')) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Model access issue. Trying with gpt-3.5-turbo might work.',
          error: error.message 
        }),
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Sorry, I encountered an error. Please try again.',
        error: error.message 
      }),
    };
  }
};
