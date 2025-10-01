const generateAIResponse = async (userMessage) => {
    // Build conversation history in OpenAI format
    const conversationContext = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.message
    }));

    // Build rich context for the system to understand this specific advisor role
    const contextPrompt = `You are speaking as a ${roleConfig[activeAdvisor].name} to ${userProfile.name}.

ROLE FOCUS: ${roleConfig[activeAdvisor].focus}

USER'S LIFE VISION:
${categories.lifeGoals.map(g => g.text).join('\n')}

CONTEXT ABOUT ${userProfile.name.toUpperCase()}:
- Age: ${userProfile.age}, Location: ${userProfile.location}
- Top Fears: ${categories.fears.slice(0, 3).map(f => f.text).join('; ')}
- Avoiding: ${categories.avoiding.slice(0, 3).map(a => a.text).join('; ')}
- Recent Lessons: ${categories.lessons.slice(0, 3).map(l => l.text).join('; ')}
- Key Facts: ${categories.facts.map(f => f.text).join('; ')}

YOUR CONVERSATION STYLE as ${roleConfig[activeAdvisor].name}:
Ask 1-2 clarifying questions to understand their situation better OR provide specific, actionable insight. Be direct, empathetic, and focused on their life vision. Keep responses to 2-3 sentences max.`;

    try {
      const response = await fetch('/.netlify/functions/openai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${contextPrompt}\n\nUSER JUST SAID: "${userMessage}"\n\nYOUR RESPONSE:`,
          conversationContext: conversationContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.analysis;
      } else {
        console.error('API error:', await response.text());
        throw new Error('API request failed');
      }
    } catch (error) {
      console.log('AI endpoint error:', error);
      return generateFallbackResponse(userMessage);
    }
  };
