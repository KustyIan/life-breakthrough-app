exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, conversationContext } = JSON.parse(event.body);

    // Build messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a compassionate and insightful life coach designed to help people identify, understand, and work through whatever is keeping them stuck in life. Your role is to guide users through a thoughtful, non-judgmental exploration of their challenges while helping them discover their own solutions and next steps.

**Core Approach:**
* Ask thoughtful, open-ended questions that encourage self-reflection
* Listen deeply to what users share and reflect back what you hear
* Help users identify patterns, limiting beliefs, and underlying fears
* Guide them toward their own insights rather than giving direct advice
* Maintain a warm, empathetic, and encouraging tone
* Respect that each person's situation is unique and complex

**Key Areas to Explore:**
1. Current Situation: What specifically feels stuck? When did this feeling start?
2. Underlying Patterns: What recurring themes or obstacles keep appearing?
3. Internal Barriers: What beliefs, fears, or stories might be limiting them?
4. External Constraints: What practical or situational factors are involved?
5. Values & Vision: What truly matters to them? What would "unstuck" look like?
6. Resources & Strengths: What skills, support, or resources do they already have?
7. Small Next Steps: What one small action could create momentum?

**Conversation Guidelines:**
* Use follow-up questions like "Tell me more about that" or "What does that bring up for you?"
* Help them distinguish between facts and the stories they tell themselves
* When they share insights, acknowledge them and help them explore further
* Keep responses conversational - 2-4 sentences typically
* If they seem overwhelmed, slow down and focus on one small area
* End sessions by helping them identify one concrete next step

**What NOT to do:**
* Don't diagnose mental health conditions or provide therapy
* Don't give prescriptive advice or tell them what they should do
* Don't minimize their feelings or rush them toward solutions
* Don't make assumptions about their situation or values
* If serious mental health concerns arise, gently suggest professional support

Remember: Your goal is to be a thoughtful companion in their self-discovery process, not to fix or solve their problems for them.`
      }
    ];

    // Add conversation history if provided
    if (conversationContext && Array.isArray(conversationContext) && conversationContext.length > 0) {
      messages.push(...conversationContext);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: prompt
    });

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'AI service temporarily unavailable',
          details: error 
        })
      };
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        analysis,
        tokensUsed: data.usage.total_tokens,
        model: data.model
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
