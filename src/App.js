import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, MessageCircle, ArrowLeft, User, MapPin, Calendar, Send } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    location: ''
  });
  const [roleSliders, setRoleSliders] = useState({
    therapist: 25,
    financialAdvisor: 25, 
    businessMentor: 25,
    father: 25
  });

  const defaultCategories = {
    nonNegotiables: [
      { id: 101, text: "My kids come first - no compromise on time with them" },
      { id: 102, text: "I will not sacrifice my health for work" },
      { id: 103, text: "Honesty in all relationships - no more living a lie" },
      { id: 104, text: "Financial decisions must support long-term stability" },
      { id: 105, text: "I need outdoor/athletic activity - not optional" }
    ],
    avoiding: [
      { id: 1, text: "Taxes" },
      { id: 2, text: "Dentist" },
      { id: 3, text: "Learning new things" },
      { id: 4, text: "Dealing with focus issues" },
      { id: 5, text: "Blood work" },
      { id: 6, text: "Seeing my father and Sisters" },
      { id: 7, text: "Family in general" },
      { id: 8, text: "Building or joining a community" },
      { id: 9, text: "Deciding on where to live" },
      { id: 10, text: "Deciding on when/if to buy mountain house" }
    ],
    fears: [
      { id: 11, text: "I am unlovable - not worthy of love" },
      { id: 12, text: "I will die soon" },
      { id: 13, text: "I will lose my kids" },
      { id: 14, text: "I will not be able to afford a life I want" },
      { id: 15, text: "I am not special" },
      { id: 16, text: "I am not smart" },
      { id: 17, text: "I will get in trouble" },
      { id: 18, text: "I will never be able to focus" },
      { id: 19, text: "I will never be happy" },
      { id: 20, text: "I am living a lie" },
      { id: 21, text: "I have no one to blame and I deserve this life" },
      { id: 22, text: "The market doesnt need me" },
      { id: 23, text: "I add no value" },
      { id: 24, text: "I am ugly" },
      { id: 25, text: "Decisions will be made for me if I dont make them soon" },
      { id: 26, text: "Competing" },
      { id: 27, text: "Being creative" },
      { id: 28, text: "I have to stay busy" },
      { id: 29, text: "Hill sprints" }
    ],
    lessons: [
      { id: 30, text: "Meditation and writing is grounding" },
      { id: 31, text: "Sauna /Ice bath 2-3x a week feels good" },
      { id: 32, text: "Working out in am is hard but good" },
      { id: 33, text: "I cant have a partner or live with someone or join families" },
      { id: 34, text: "Tech doesnt excite me" },
      { id: 35, text: "I wouldnt want my kids to do the work I do" },
      { id: 36, text: "I still have time to: win, succeed, reinvent, learn, teach, grow, repair" },
      { id: 37, text: "I can be me - there is an authentic me" },
      { id: 38, text: "I can set boundaries and express my needs" },
      { id: 39, text: "Communicating well is hard work" },
      { id: 40, text: "I can manage my anxiety" }
    ],
    facts: [
      { id: 41, text: "$60k debt" },
      { id: 42, text: "$800k in assets" },
      { id: 43, text: "Twins have 6 more years in Briar Chapel" },
      { id: 44, text: "Isaiah will need a home near Briar Chapel for 2 more years" },
      { id: 45, text: "Judah will need a home near Briar Chapel for 2 more years" },
      { id: 46, text: "I currently need to make 250k to break even with current expenses and lifestyle" }
    ],
    decisions: [],
    lifeGoals: [
      { id: 47, text: "To be a part of a community that is open, honest, uplifting, accountable, artistic and outdoorsy/ athletic" },
      { id: 48, text: "House and Land I can build on or around, remodel" },
      { id: 49, text: "To be close to my kids" },
      { id: 50, text: "To know that kids are prepared for their lives" },
      { id: 51, text: "To be financially stable" },
      { id: 52, text: "To have a low pressure intimiate partner" }
    ]
  };

  const [categories, setCategories] = useState(defaultCategories);
  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState('lifeGoals');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [activeAdvisor, setActiveAdvisor] = useState(null);
  const [advisorConversations, setAdvisorConversations] = useState({
    therapist: [],
    financialAdvisor: [],
    businessMentor: [],
    father: []
  });

  useEffect(() => {
    if (!userProfile.name) return; // Don't load until we have a name
    
    const storageKey = `breakthroughAppData_${userProfile.name.toLowerCase().replace(/\s+/g, '_')}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.userProfile && (parsed.userProfile.name || parsed.userProfile.age)) {
        setUserProfile(parsed.userProfile);
      }
      if (parsed.roleSliders) setRoleSliders(parsed.roleSliders);
      if (parsed.currentStep && parsed.userProfile && parsed.userProfile.name) {
        setCurrentStep(parsed.currentStep);
      }
      if (parsed.categories && parsed.userProfile && parsed.userProfile.name && 
          Object.values(parsed.categories).some(cat => cat.length > 0)) {
        setCategories(parsed.categories);
      }
      if (parsed.conversationHistory) setConversationHistory(parsed.conversationHistory);
      if (parsed.advisorConversations) setAdvisorConversations(parsed.advisorConversations);
    }
  }, [userProfile.name]);

  useEffect(() => {
    if (!userProfile.name) return; // Don't save until we have a name
    
    const storageKey = `breakthroughAppData_${userProfile.name.toLowerCase().replace(/\s+/g, '_')}`;
    const dataToSave = {
      userProfile,
      roleSliders,
      categories,
      currentStep,
      conversationHistory,
      advisorConversations
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [userProfile, roleSliders, categories, currentStep, conversationHistory, advisorConversations]);

  const categoryConfig = {
    lifeGoals: {
      title: "What do you want out of this life?",
      placeholder: "e.g., Build a business that gives me freedom and helps others",
      description: "Your aspirations, dreams, and what success means to you",
      priority: 1
    },
    nonNegotiables: {
      title: "What are your non-negotiables?",
      placeholder: "e.g., My kids always come first, I will not compromise my integrity",
      description: "Firm boundaries and commitments that guide your path to your life vision",
      priority: 2
    },
    avoiding: {
      title: "What are you avoiding?",
      placeholder: "e.g., Having a difficult conversation with my boss",
      description: "Things blocking your path to your life goals",
      priority: 3
    },
    fears: {
      title: "What are your fears?",
      placeholder: "e.g., Fear of financial instability",
      description: "What's holding you back from your vision",
      priority: 4
    },
    lessons: {
      title: "What did you learn last year?",
      placeholder: "e.g., I need to set better boundaries",
      description: "Resources you can use to reach your goals",
      priority: 5
    },
    facts: {
      title: "Facts and Responsibilities",
      placeholder: "e.g., I have 2 kids, I need to earn $80k annually",
      description: "Realities that shape your path forward",
      priority: 6
    },
    decisions: {
      title: "Decisions I need to make",
      placeholder: "e.g., Whether to change careers",
      description: "Choices that will move you toward your goals",
      priority: 7
    }
  };

  const roleConfig = {
    therapist: {
      name: "Therapist",
      description: "Emotional wellness & relationships",
      color: "bg-purple-500",
      focus: "Understanding your emotional patterns and relational dynamics to support your life vision"
    },
    financialAdvisor: {
      name: "Financial Advisor", 
      description: "Money & financial strategy",
      color: "bg-green-500",
      focus: "Creating financial stability and abundance to enable your desired lifestyle"
    },
    businessMentor: {
      name: "Business Mentor",
      description: "Career & professional growth", 
      color: "bg-blue-500",
      focus: "Building a career path that aligns with your authentic self and life goals"
    },
    father: {
      name: "Father Figure",
      description: "Wisdom & life guidance",
      color: "bg-orange-500",
      focus: "Providing perspective, tough love, and wisdom to help you become who you want to be"
    }
  };

  const handleSliderChange = (changedRole, newValue) => {
    const currentTotal = Object.values(roleSliders).reduce((sum, val) => sum + val, 0);
    const otherRoles = Object.keys(roleSliders).filter(role => role !== changedRole);
    const otherTotal = currentTotal - roleSliders[changedRole];
    const newSliders = { ...roleSliders, [changedRole]: newValue };
    
    if (otherTotal > 0) {
      const remainingPercentage = 100 - newValue;
      otherRoles.forEach(role => {
        const proportion = roleSliders[role] / otherTotal;
        newSliders[role] = Math.max(0, Math.round(remainingPercentage * proportion));
      });
    } else {
      const equalShare = Math.floor((100 - newValue) / otherRoles.length);
      otherRoles.forEach(role => {
        newSliders[role] = equalShare;
      });
    }
    
    const finalTotal = Object.values(newSliders).reduce((sum, val) => sum + val, 0);
    if (finalTotal !== 100) {
      const adjustment = 100 - finalTotal;
      const adjustRole = otherRoles[0];
      newSliders[adjustRole] = Math.max(0, newSliders[adjustRole] + adjustment);
    }
    
    setRoleSliders(newSliders);
  };

  const calculateDefaultSliders = () => {
    const age = parseInt(userProfile.age) || 25;
    if (age < 25) return { therapist: 30, financialAdvisor: 20, businessMentor: 35, father: 15 };
    if (age < 35) return { therapist: 25, financialAdvisor: 30, businessMentor: 30, father: 15 };
    if (age < 50) return { therapist: 20, financialAdvisor: 35, businessMentor: 25, father: 20 };
    return { therapist: 20, financialAdvisor: 30, businessMentor: 20, father: 30 };
  };

  const handleSetupComplete = () => {
    const defaults = calculateDefaultSliders();
    setRoleSliders(defaults);
    setCurrentStep('input');
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    const newItem = { id: Date.now(), text: newItemText.trim() };
    setCategories(prev => ({ ...prev, [activeCategory]: [...prev[activeCategory], newItem] }));
    setNewItemText('');
  };

  const removeItem = (categoryKey, itemId) => {
    setCategories(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter(item => item.id !== itemId)
    }));
  };

  const handleDragStart = (e, categoryKey, itemIndex) => {
    setDraggedItem({ categoryKey, itemIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem && targetIndex !== draggedItem.itemIndex) {
      setDropTargetIndex(targetIndex);
    }
  };

  const handleDrop = (e, categoryKey, targetIndex) => {
    e.preventDefault();
    setDropTargetIndex(null);
    
    if (!draggedItem || draggedItem.categoryKey !== categoryKey) return;
    if (draggedItem.itemIndex === targetIndex) return;
    
    const items = [...categories[categoryKey]];
    const [movedItem] = items.splice(draggedItem.itemIndex, 1);
    
    // Adjust target index if dragging down
    const newIndex = draggedItem.itemIndex < targetIndex ? targetIndex - 1 : targetIndex;
    items.splice(newIndex, 0, movedItem);
    
    setCategories(prev => ({ ...prev, [categoryKey]: items }));
    setDraggedItem(null);
  };

  const getTotalItems = () => {
    return Object.values(categories).reduce((total, items) => total + items.length, 0);
  };

  const loadDefaultData = () => {
    setCategories(defaultCategories);
    localStorage.removeItem('breakthroughAppData');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setCategories({ avoiding: [], fears: [], lessons: [], facts: [], decisions: [], lifeGoals: [] });
      setUserProfile({ name: '', age: '', location: '' });
      setCurrentStep('setup');
      setActiveCategory('lifeGoals');
      setConversationHistory([]);
      localStorage.removeItem('breakthroughAppData');
    }
  };

  const startAdvisorConversation = (advisorRole) => {
    setActiveAdvisor(advisorRole);
    setCurrentStep('conversation');
    
    // Load existing conversation for this advisor or start fresh
    if (advisorConversations[advisorRole].length > 0) {
      setConversationHistory(advisorConversations[advisorRole]);
    } else {
      const greeting = generateAdvisorGreeting(advisorRole);
      const initialHistory = [{ role: 'advisor', advisor: advisorRole, message: greeting, timestamp: new Date() }];
      setConversationHistory(initialHistory);
      setAdvisorConversations(prev => ({ ...prev, [advisorRole]: initialHistory }));
    }
  };

  const generateAdvisorGreeting = (advisorRole) => {
    const topGoal = categories.lifeGoals[0]?.text || "your life goals";
    const greetings = {
      therapist: `Hi ${userProfile.name}, I'm here to help you understand the emotional patterns that might be blocking you from "${topGoal}". Let's explore what's really going on beneath the surface. What feels most stuck right now?`,
      financialAdvisor: `${userProfile.name}, let's talk about the financial side of reaching "${topGoal}". With your $800k in assets and current income needs, I have some questions about your strategy. What's your biggest financial concern right now?`,
      businessMentor: `Hey ${userProfile.name}, I want to help you build a career that actually serves "${topGoal}". You mentioned tech doesn't excite you anymore - that's important. What kind of work would make you feel alive?`,
      father: `${userProfile.name}, son, let's get real about "${topGoal}". You've got 6 years with your kids in Briar Chapel - that's your window. What are you most afraid of when it comes to making this vision real?`
    };
    return greetings[advisorRole];
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    const userMsg = { role: 'user', message: currentMessage, timestamp: new Date() };
    const updatedHistory = [...conversationHistory, userMsg];
    setConversationHistory(updatedHistory);
    setCurrentMessage('');
    setIsAIResponding(true);
    
    try {
      const response = await generateAIResponse(currentMessage);
      const advisorMsg = { role: 'advisor', advisor: activeAdvisor, message: response, timestamp: new Date() };
      const finalHistory = [...updatedHistory, advisorMsg];
      setConversationHistory(finalHistory);
      // Save to this advisor's conversation history
      setAdvisorConversations(prev => ({ ...prev, [activeAdvisor]: finalHistory }));
    } catch (error) {
      console.error('AI response failed:', error);
      const fallbackMsg = { role: 'advisor', advisor: activeAdvisor, message: "I'm having trouble connecting right now. Can you tell me more about that?", timestamp: new Date() };
      const finalHistory = [...updatedHistory, fallbackMsg];
      setConversationHistory(finalHistory);
      setAdvisorConversations(prev => ({ ...prev, [activeAdvisor]: finalHistory }));
    } finally {
      setIsAIResponding(false);
    }
  };

  const triggerIntegrationSession = async () => {
    if (!currentMessage.trim()) return;
    const userMsg = { role: 'user', message: currentMessage, timestamp: new Date() };
    const updatedHistory = [...conversationHistory, userMsg];
    setConversationHistory(updatedHistory);
    setCurrentMessage('');
    setIsAIResponding(true);

    try {
      const response = await generateIntegrationResponse(currentMessage);
      const integrationMsg = { 
        role: 'integration', 
        message: response, 
        timestamp: new Date() 
      };
      const finalHistory = [...updatedHistory, integrationMsg];
      setConversationHistory(finalHistory);
      setAdvisorConversations(prev => ({ ...prev, [activeAdvisor]: finalHistory }));
    } catch (error) {
      console.error('Integration session failed:', error);
      const fallbackMsg = { role: 'advisor', advisor: activeAdvisor, message: "I'm having trouble connecting the team right now. Let me respond individually for now.", timestamp: new Date() };
      const finalHistory = [...updatedHistory, fallbackMsg];
      setConversationHistory(finalHistory);
      setAdvisorConversations(prev => ({ ...prev, [activeAdvisor]: finalHistory }));
    } finally {
      setIsAIResponding(false);
    }
  };

  const generateIntegrationResponse = async (userMessage) => {
    console.log('=== INTEGRATION SESSION ===');
    
    // Gather all advisor conversation summaries
    const advisorSummaries = Object.entries(advisorConversations)
      .filter(([key, history]) => history.length > 1)
      .map(([advisorKey, history]) => {
        const recentMessages = history.slice(-6); // Last 3 exchanges
        return `${roleConfig[advisorKey].name}:\n${recentMessages.map(msg => `- ${msg.message.substring(0, 150)}...`).join('\n')}`;
      })
      .join('\n\n');

    const integrationPrompt = `You are facilitating an INTEGRATION SESSION where all 4 advisors collaborate on ${userProfile.name}'s question.

USER'S PRIMARY LIFE GOAL: ${categories.lifeGoals[0]?.text || 'Not yet defined'}

NON-NEGOTIABLES (Firm boundaries - must be respected in all advice):
${categories.nonNegotiables.map(n => n.text).join('\n') || 'None specified yet.'}

RECENT CONVERSATIONS WITH EACH ADVISOR:
${advisorSummaries || 'No previous conversations yet.'}

USER'S CURRENT QUESTION: "${userMessage}"

YOUR TASK:
Simulate all 4 advisors (Therapist, Financial Advisor, Business Mentor, Father Figure) discussing this together. Each advisor should:
1. Briefly acknowledge what they've learned from their previous conversation with ${userProfile.name}
2. Offer their unique perspective on the current question
3. Reference insights from other advisors when relevant
4. RESPECT ALL NON-NEGOTIABLES - these are firm boundaries that guide solutions
5. Always tie recommendations back to the primary life goal

Format your response as a collaborative discussion, like:
"[Therapist] I notice from our talks that... and I wonder if...
[Financial Advisor] Building on that, from a financial perspective...
[Business Mentor] The career angle here is...
[Father Figure] Let me cut through the noise..."

End with 1-2 concrete, integrated next steps that combine all perspectives, respect the non-negotiables, and move ${userProfile.name} toward their life goal.

Keep it under 250 words - this is an actionable synthesis, not a lecture.`;

    try {
      const response = await fetch('/.netlify/functions/openai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: integrationPrompt,
          conversationContext: [] // Fresh context for integration
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.analysis;
      } else {
        throw new Error('Integration API failed');
      }
    } catch (error) {
      console.error('Integration fetch error:', error);
      throw error;
    }
  };

  const generateAIResponse = async (userMessage) => {
    console.log('=== GENERATING AI RESPONSE ===');
    console.log('User message:', userMessage);
    console.log('Active advisor:', activeAdvisor);
    console.log('Conversation history length:', conversationHistory.length);

    const conversationContext = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.message
    }));

    console.log('Formatted context:', conversationContext);

    const contextPrompt = `You are speaking as a ${roleConfig[activeAdvisor].name} to ${userProfile.name}.

ROLE FOCUS: ${roleConfig[activeAdvisor].focus}

USER'S LIFE VISION:
${categories.lifeGoals.map(g => g.text).join('\n')}

NON-NEGOTIABLES (Firm boundaries that must be respected):
${categories.nonNegotiables.map(n => n.text).join('\n')}

CONTEXT ABOUT ${userProfile.name.toUpperCase()}:
- Age: ${userProfile.age}, Location: ${userProfile.location}
- Top Fears: ${categories.fears.slice(0, 3).map(f => f.text).join('; ')}
- Avoiding: ${categories.avoiding.slice(0, 3).map(a => a.text).join('; ')}
- Recent Lessons: ${categories.lessons.slice(0, 3).map(l => l.text).join('; ')}
- Key Facts: ${categories.facts.map(f => f.text).join('; ')}

YOUR CONVERSATION STYLE as ${roleConfig[activeAdvisor].name}:
Ask 1-2 clarifying questions to understand their situation better OR provide specific, actionable insight. Be direct, empathetic, and focused on their life vision. Keep responses to 2-3 sentences max. ALWAYS respect their non-negotiables - these are firm boundaries.`;

    console.log('Context prompt length:', contextPrompt.length);

    try {
      console.log('Calling Netlify function...');
      const response = await fetch('/.netlify/functions/openai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${contextPrompt}\n\nUSER JUST SAID: "${userMessage}"\n\nYOUR RESPONSE:`,
          conversationContext: conversationContext
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('OpenAI response:', data);
        return data.analysis;
      } else {
        const errorText = await response.text();
        console.error('API error status:', response.status);
        console.error('API error text:', errorText);
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      console.log('Using fallback response');
      return generateFallbackResponse(userMessage);
    }
  };

  const generateFallbackResponse = (userMessage) => {
    const responses = {
      therapist: [
        "That's a lot to carry. What emotion comes up strongest when you think about that?",
        "I hear you. How long have you felt this way?",
        "What would it mean if you could move past this fear?"
      ],
      financialAdvisor: [
        "Let's look at the numbers. How much runway do you have with current expenses?",
        "What income streams have you considered beyond your current work?",
        "If money wasn't a concern, what would you do differently?"
      ],
      businessMentor: [
        "What skills do you have that you're not fully using right now?",
        "When was the last time you felt energized by work?",
        "What would a perfect work week look like for you?"
      ],
      father: [
        "Stop overthinking. What's the first small step you could take today?",
        "Your kids are watching. What do you want them to learn from how you handle this?",
        "What would the man you want to become do in this situation?"
      ]
    };
    const advisorResponses = responses[activeAdvisor];
    return advisorResponses[Math.floor(Math.random() * advisorResponses.length)];
  };

  if (currentStep === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Breakthrough Journey</h1>
          <p className="text-lg opacity-90">Let's start by getting to know you</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <User size={20} />What's your name?
            </label>
            <input type="text" value={userProfile.name} onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter your first name" className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <Calendar size={20} />How old are you?
            </label>
            <input type="number" value={userProfile.age} onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))} placeholder="Enter your age" className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <MapPin size={20} />Where are you located?
            </label>
            <input type="text" value={userProfile.location} onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))} placeholder="City, State/Country" className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors" />
          </div>
          <button onClick={handleSetupComplete} disabled={!userProfile.name || !userProfile.age || !userProfile.location} className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            Start Your Breakthrough Journey
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'conversation' && activeAdvisor && roleConfig[activeAdvisor]) {
    const advisorConfig = roleConfig[activeAdvisor];
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen flex flex-col">
        <div className={`${advisorConfig.color} text-white p-6 rounded-lg mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Conversation with {advisorConfig.name}</h1>
              <p className="opacity-90">{advisorConfig.focus}</p>
            </div>
            <button onClick={() => setCurrentStep('input')} className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-gray-50 p-6 rounded-lg">
          {conversationHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : msg.role === 'integration'
                  ? 'bg-gradient-to-r from-purple-500 via-green-500 to-orange-500 text-white'
                  : `${advisorConfig.color} text-white`
              }`}>
                {msg.role === 'advisor' && <div className="text-xs opacity-75 mb-1">{advisorConfig.name}</div>}
                {msg.role === 'integration' && <div className="text-xs opacity-75 mb-1 font-bold">🤝 All Advisors Collaborating</div>}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
              </div>
            </div>
          ))}
          {isAIResponding && (
            <div className="flex justify-start">
              <div className={`max-w-[70%] p-4 rounded-lg ${advisorConfig.color} text-white`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Type your response..." className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
          <button onClick={triggerIntegrationSession} disabled={!currentMessage.trim() || isAIResponding} className="px-4 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium" title="Get input from all advisors">
            🤝
          </button>
          <button onClick={sendMessage} disabled={!currentMessage.trim() || isAIResponding} className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">What Do You Want Out of This Life, {userProfile.name}?</h1>
        <p className="text-xl opacity-90 mb-6">Everything else is here to help you get there.</p>
        {categories.lifeGoals.length > 0 && (
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3">Your Vision:</h3>
            <ul className="space-y-2">
              {categories.lifeGoals.slice(0, 3).map((goal, index) => (
                <li key={goal.id} className="flex items-start gap-3">
                  <span className="text-2xl">{index === 0 ? '🎯' : index === 1 ? '✨' : '🌟'}</span>
                  <span className="text-lg">{goal.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-semibold mb-2">Your Advisory Team</h3>
        <p className="text-gray-600 mb-6">Each advisor offers unique perspective to help you reach your life goals. Adjust their influence or start a conversation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(roleConfig).map(([key, role]) => (
            <div key={key} className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-full ${role.color} flex items-center justify-center text-white font-bold text-lg`}>{roleSliders[key]}%</div>
                    <div>
                      <label className="font-semibold text-gray-800">{role.name}</label>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.focus}</p>
                </div>
              </div>
              <input type="range" min="0" max="100" value={roleSliders[key]} onChange={(e) => handleSliderChange(key, parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <button onClick={() => startAdvisorConversation(key)} className={`w-full ${role.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2`}>
                <MessageCircle size={16} />Start Conversation
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {Object.entries(categoryConfig).sort(([,a], [,b]) => a.priority - b.priority).map(([key, config]) => (
          <button key={key} onClick={() => setActiveCategory(key)} className={`px-4 py-2 rounded-t-lg transition-colors text-sm ${activeCategory === key ? key === 'lifeGoals' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {config.title} ({categories[key].length})
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className={`${activeCategory === 'lifeGoals' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50'} p-6 rounded-lg border-2`}>
            <h2 className="text-xl font-semibold mb-2">{categoryConfig[activeCategory].title}</h2>
            <p className="text-gray-600 text-sm mb-4">{categoryConfig[activeCategory].description}</p>
            <div className="space-y-3">
              <textarea value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder={categoryConfig[activeCategory].placeholder} className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows="3" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addItem(); } }} />
              <button onClick={addItem} disabled={!newItemText.trim()} className={`w-full flex items-center justify-center gap-2 ${activeCategory === 'lifeGoals' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}>
                <Plus size={16} />Add {activeCategory === 'lifeGoals' ? 'Life Goal' : 'Item'}
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{activeCategory === 'lifeGoals' ? 'Your Life Vision (Most important at top)' : 'Rank by Priority'}</h3>
              <span className="text-sm text-gray-500">Drag to reorder</span>
            </div>
            {categories[activeCategory].length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>Add items to start ranking them by importance</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories[activeCategory].map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, activeCategory, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, activeCategory, index)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-move transition-all ${
                      activeCategory === 'lifeGoals' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50'
                    } ${
                      draggedItem?.itemIndex === index ? 'opacity-40 scale-95' : 'hover:bg-gray-100'
                    } ${
                      dropTargetIndex === index && draggedItem?.itemIndex !== index 
                        ? 'border-blue-500 border-2 shadow-lg scale-105' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-sm font-medium min-w-[20px]">#{index + 1}</span>
                      <GripVertical size={16} />
                    </div>
                    <p className="flex-1 text-gray-800">{item.text}</p>
                    <button onClick={() => removeItem(activeCategory, item.id)} className="opacity-0 hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-all" title="Remove item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Ready to work with your advisory team?</h3>
            <p className="text-gray-600">You've defined {categories.lifeGoals.length} life goals with {getTotalItems() - categories.lifeGoals.length} supporting data points</p>
          </div>
          <div className="flex gap-3">
            {userProfile.name.toLowerCase() === 'ian' && (
              <button onClick={loadDefaultData} className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">Load Demo Data</button>
            )}
            {getTotalItems() > 0 && (
              <button onClick={clearAllData} className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">Start Over</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
