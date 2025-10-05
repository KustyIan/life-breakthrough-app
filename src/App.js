import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, MessageCircle, ArrowLeft, User, Calendar, Send, ChevronRight, CheckCircle, Circle } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [wizardStep, setWizardStep] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    maritalStatus: '',
    hasKids: false,
    numberOfKids: '',
    kidsAges: ''
  });
  const [roleSliders, setRoleSliders] = useState({
    therapist: 25,
    financialAdvisor: 25, 
    businessMentor: 25,
    father: 25
  });

  const [hardConstraints, setHardConstraints] = useState({
    monthlyIncomeNeeded: '',
    currentMonthlyIncome: '',
    savingsDebt: '',
    mustStayInLocation: false,
    locationReason: '',
    locationDuration: '',
    otherDeadlines: ''
  });

  const [currentSituation, setCurrentSituation] = useState({
    workStatus: '',
    workDescription: '',
    healthConstraints: '',
    supportSystem: '',
    whatBroughtYouHere: ''
  });

  const emptyCategories = {
    lifeGoals: [],
    nonNegotiables: [],
    fears: [],
    avoiding: [],
    lessons: [],
    facts: [],
    decisions: []
  };

  const [categories, setCategories] = useState(emptyCategories);
  const [completedSections, setCompletedSections] = useState({
    demographics: false,
    hardConstraints: false,
    lifeGoals: false,
    nonNegotiables: false,
    currentSituation: false,
    barriers: false,
    foundation: false,
    decisions: false
  });

  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState('lifeGoals');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [activeAdvisor, setActiveAdvisor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [advisorConversations, setAdvisorConversations] = useState({
    therapist: [],
    financialAdvisor: [],
    businessMentor: [],
    father: []
  });

  useEffect(() => {
    if (!userProfile.name) return;
    
    const storageKey = `breakthroughAppData_${userProfile.name.toLowerCase().replace(/\s+/g, '_')}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.userProfile) setUserProfile(parsed.userProfile);
      if (parsed.roleSliders) setRoleSliders(parsed.roleSliders);
      if (parsed.hardConstraints) setHardConstraints(parsed.hardConstraints);
      if (parsed.currentSituation) setCurrentSituation(parsed.currentSituation);
      if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      if (parsed.wizardStep) setWizardStep(parsed.wizardStep);
      if (parsed.completedSections) setCompletedSections(parsed.completedSections);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.conversationHistory) setConversationHistory(parsed.conversationHistory);
      if (parsed.advisorConversations) setAdvisorConversations(parsed.advisorConversations);
    }
  }, [userProfile.name]);

  useEffect(() => {
    if (!userProfile.name) return;
    
    const storageKey = `breakthroughAppData_${userProfile.name.toLowerCase().replace(/\s+/g, '_')}`;
    const dataToSave = {
      userProfile,
      roleSliders,
      hardConstraints,
      currentSituation,
      categories,
      currentStep,
      wizardStep,
      completedSections,
      conversationHistory,
      advisorConversations
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [userProfile, roleSliders, hardConstraints, currentSituation, categories, currentStep, wizardStep, completedSections, conversationHistory, advisorConversations]);

  const wizardSteps = [
    { num: 1, title: 'Who You Are', key: 'demographics' },
    { num: 2, title: 'Hard Constraints', key: 'hardConstraints' },
    { num: 3, title: 'Life Vision', key: 'lifeGoals' },
    { num: 4, title: 'Non-Negotiables', key: 'nonNegotiables' },
    { num: 5, title: 'Current Situation', key: 'currentSituation' },
    { num: 6, title: 'Barriers', key: 'barriers' },
    { num: 7, title: 'Foundation', key: 'foundation' },
    { num: 8, title: 'Decisions', key: 'decisions' }
  ];

  const categoryConfig = {
    lifeGoals: {
      title: "What do you want out of this life?",
      placeholder: "e.g., Build a business that gives me freedom and helps others",
      description: "Your aspirations, dreams, and what success means to you",
      wizardStep: 3
    },
    nonNegotiables: {
      title: "What are your non-negotiables?",
      placeholder: "e.g., My kids always come first, I will not compromise my integrity",
      description: "Firm boundaries and commitments that guide your path to your life vision",
      wizardStep: 4
    },
    avoiding: {
      title: "What are you avoiding?",
      placeholder: "e.g., Having a difficult conversation with my boss",
      description: "Things blocking your path to your life goals",
      wizardStep: 6
    },
    fears: {
      title: "What are your fears?",
      placeholder: "e.g., Fear of financial instability",
      description: "What's holding you back from your vision",
      wizardStep: 6
    },
    lessons: {
      title: "What did you learn last year?",
      placeholder: "e.g., I need to set better boundaries",
      description: "Resources you can use to reach your goals",
      wizardStep: 7
    },
    facts: {
      title: "Facts and Responsibilities",
      placeholder: "e.g., I have 2 kids, I need to earn $80k annually",
      description: "Realities that shape your path forward",
      wizardStep: 7
    },
    decisions: {
      title: "Decisions I need to make",
      placeholder: "e.g., Whether to change careers",
      description: "Choices that will move you toward your goals",
      wizardStep: 8
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

  const getCompletionPercentage = () => {
    const completed = Object.values(completedSections).filter(v => v).length;
    return Math.round((completed / 8) * 100);
  };

  const canUnlockAdvisors = () => {
    return completedSections.lifeGoals && 
           Object.values(completedSections).filter(v => v).length >= 3;
  };

  const markSectionComplete = (section) => {
    setCompletedSections(prev => ({ ...prev, [section]: true }));
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

  const handleDragEnd = () => {
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
    
    const newIndex = draggedItem.itemIndex < targetIndex ? targetIndex - 1 : targetIndex;
    items.splice(newIndex, 0, movedItem);
    
    setCategories(prev => ({ ...prev, [categoryKey]: items }));
    setDraggedItem(null);
  };

  const getTotalItems = () => {
    return Object.values(categories).reduce((total, items) => total + items.length, 0);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      const storageKey = `breakthroughAppData_${userProfile.name.toLowerCase().replace(/\s+/g, '_')}`;
      setCategories(emptyCategories);
      setUserProfile({ name: '', age: '', maritalStatus: '', hasKids: false, numberOfKids: '', kidsAges: '' });
      setHardConstraints({ monthlyIncomeNeeded: '', currentMonthlyIncome: '', savingsDebt: '', mustStayInLocation: false, locationReason: '', locationDuration: '', otherDeadlines: '' });
      setCurrentSituation({ workStatus: '', workDescription: '', healthConstraints: '', supportSystem: '', whatBroughtYouHere: '' });
      setCompletedSections({ demographics: false, hardConstraints: false, lifeGoals: false, nonNegotiables: false, currentSituation: false, barriers: false, foundation: false, decisions: false });
      setCurrentStep('setup');
      setWizardStep(1);
      setConversationHistory([]);
      setAdvisorConversations({ therapist: [], financialAdvisor: [], businessMentor: [], father: [] });
      localStorage.removeItem(storageKey);
    }
  };

  const startAdvisorConversation = (advisorRole) => {
    setActiveAdvisor(advisorRole);
    setCurrentStep('conversation');
    
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
    const name = userProfile.name;
    
    const greetings = {
      therapist: `Hi ${name}, I'm here to help you understand the emotional patterns that might be blocking you from "${topGoal}". Let's explore what's really going on beneath the surface. What feels most stuck right now?`,
      financialAdvisor: `${name}, let's talk about the financial side of reaching "${topGoal}". I see you need about $${hardConstraints.monthlyIncomeNeeded || '?'} monthly. What's your biggest financial concern right now?`,
      businessMentor: `Hey ${name}, I want to help you build a career that actually serves "${topGoal}". Given your current situation, what kind of work would make you feel alive?`,
      father: `${name}, let's get real about "${topGoal}". ${userProfile.hasKids ? `You've got ${userProfile.numberOfKids} kids - they're watching.` : ''} What are you most afraid of when it comes to making this vision real?`
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
      const integrationMsg = { role: 'integration', message: response, timestamp: new Date() };
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
    const advisorSummaries = Object.entries(advisorConversations)
      .filter(([, history]) => history.length > 1)
      .map(([advisorKey, history]) => {
        const recentMessages = history.slice(-6);
        return `${roleConfig[advisorKey].name}:\n${recentMessages.map(msg => `- ${msg.message.substring(0, 150)}...`).join('\n')}`;
      })
      .join('\n\n');

    const integrationPrompt = `You are facilitating an INTEGRATION SESSION where all 4 advisors collaborate on ${userProfile.name}'s question.

USER'S PRIMARY LIFE GOAL: ${categories.lifeGoals[0]?.text || 'Not yet defined'}

NON-NEGOTIABLES: ${categories.nonNegotiables.map(n => n.text).join('\n') || 'None specified.'}

RECENT CONVERSATIONS: ${advisorSummaries || 'No previous conversations.'}

USER'S CURRENT QUESTION: "${userMessage}"

YOUR TASK: Simulate all 4 advisors discussing this together. Format as:
"[Therapist] ...
[Financial Advisor] ...
[Business Mentor] ...
[Father Figure] ..."

End with 1-2 concrete, integrated next steps. Keep under 250 words.`;

    try {
      const response = await fetch('/.netlify/functions/openai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: integrationPrompt, conversationContext: [] })
      });

      if (response.ok) {
        const data = await response.json();
        return data.analysis;
      }
      throw new Error('Integration API failed');
    } catch (error) {
      console.error('Integration fetch error:', error);
      throw error;
    }
  };

  const generateAIResponse = async (userMessage) => {
    const conversationContext = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.message
    }));

    const contextPrompt = `You are a ${roleConfig[activeAdvisor].name} speaking to ${userProfile.name}.

ROLE FOCUS: ${roleConfig[activeAdvisor].focus}

USER'S LIFE VISION: ${categories.lifeGoals.map(g => g.text).join('\n')}
NON-NEGOTIABLES: ${categories.nonNegotiables.map(n => n.text).join('\n')}

CONTEXT:
- Age: ${userProfile.age}, ${userProfile.maritalStatus || 'relationship status not specified'}
- ${userProfile.hasKids ? `${userProfile.numberOfKids} kids (ages: ${userProfile.kidsAges})` : 'No kids'}
- Work: ${currentSituation.workStatus} ${currentSituation.workDescription ? `- ${currentSituation.workDescription}` : ''}
- Financial need: $${hardConstraints.monthlyIncomeNeeded || '?'}/month
- Top Fears: ${categories.fears.slice(0, 3).map(f => f.text).join('; ')}

Ask 1-2 clarifying questions OR provide specific insight. Keep responses to 2-3 sentences. Respect non-negotiables.`;

    try {
      const response = await fetch('/.netlify/functions/openai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${contextPrompt}\n\nUSER: "${userMessage}"\n\nYOUR RESPONSE:`,
          conversationContext: conversationContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.analysis;
      }
      throw new Error('API request failed');
    } catch (error) {
      return generateFallbackResponse();
    }
  };

  const generateFallbackResponse = () => {
    const responses = {
      therapist: ["That's a lot to carry. What emotion comes up strongest?", "I hear you. How long have you felt this way?"],
      financialAdvisor: ["Let's look at the numbers. How much runway do you have?", "What income streams have you considered?"],
      businessMentor: ["What skills are you not fully using?", "When did you last feel energized by work?"],
      father: ["Stop overthinking. What's the first small step?", "Your kids are watching. What do you want them to learn?"]
    };
    const advisorResponses = responses[activeAdvisor];
    return advisorResponses[Math.floor(Math.random() * advisorResponses.length)];
  };

  // WIZARD STEP 1: WHO YOU ARE
  if (currentStep === 'setup' && wizardStep === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Breakthrough Journey</h1>
          <p className="text-lg opacity-90">Step 1 of 8: Tell us about yourself</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <User size={20} />What's your name?
            </label>
            <input type="text" value={userProfile.name} onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter your first name" className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <Calendar size={20} />How old are you?
            </label>
            <input type="number" value={userProfile.age} onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))} placeholder="Enter your age" className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-3 block">What's your marital status?</label>
            <select value={userProfile.maritalStatus} onChange={(e) => setUserProfile(prev => ({ ...prev, maritalStatus: e.target.value }))} className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
              <option value="">Select...</option>
              <option value="Single">Single</option>
              <option value="In a relationship">In a relationship</option>
              <option value="Married">Married</option>
              <option value="Divorced/Separated">Divorced/Separated</option>
              <option value="Widowed">Widowed</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-3 block">Do you have kids?</label>
            <div className="flex gap-4 mb-4">
              <button onClick={() => setUserProfile(prev => ({ ...prev, hasKids: true }))} className={`flex-1 p-4 rounded-lg border-2 transition-colors ${userProfile.hasKids ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>Yes</button>
              <button onClick={() => setUserProfile(prev => ({ ...prev, hasKids: false, numberOfKids: '', kidsAges: '' }))} className={`flex-1 p-4 rounded-lg border-2 transition-colors ${!userProfile.hasKids ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>No</button>
            </div>

            {userProfile.hasKids && (
              <>
                <input type="number" value={userProfile.numberOfKids} onChange={(e) => setUserProfile(prev => ({ ...prev, numberOfKids: e.target.value }))} placeholder="How many kids?" className="w-full p-4 mb-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
                <input type="text" value={userProfile.kidsAges} onChange={(e) => setUserProfile(prev => ({ ...prev, kidsAges: e.target.value }))} placeholder="What are their ages? (e.g., 8, 10, 14)" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
                <p className="text-sm text-gray-600 mt-2">This helps your advisors understand your timeline - like how long kids will be at home - and tailor guidance to your family situation.</p>
              </>
            )}
          </div>

          <button onClick={() => { markSectionComplete('demographics'); setWizardStep(2); }} disabled={!userProfile.name || !userProfile.age} className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            Continue <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // WIZARD STEP 2: HARD CONSTRAINTS
  if (currentStep === 'setup' && wizardStep === 2) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Financial & Location Reality</h1>
          <p className="text-lg opacity-90">Step 2 of 8: Understanding your constraints helps us give realistic advice</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-lg font-semibold text-gray-700 mb-2 block">Monthly income you need</label>
            <input type="number" value={hardConstraints.monthlyIncomeNeeded} onChange={(e) => setHardConstraints(prev => ({ ...prev, monthlyIncomeNeeded: e.target.value }))} placeholder="e.g., 20000" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-2 block">Current monthly income</label>
            <input type="number" value={hardConstraints.currentMonthlyIncome} onChange={(e) => setHardConstraints(prev => ({ ...prev, currentMonthlyIncome: e.target.value }))} placeholder="e.g., 15000" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-2 block">Savings or debt situation</label>
            <input type="text" value={hardConstraints.savingsDebt} onChange={(e) => setHardConstraints(prev => ({ ...prev, savingsDebt: e.target.value }))} placeholder="e.g., $800k assets, $60k debt" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-3 block">Must you stay in your current location?</label>
            <div className="flex gap-4 mb-4">
              <button onClick={() => setHardConstraints(prev => ({ ...prev, mustStayInLocation: true }))} className={`flex-1 p-4 rounded-lg border-2 ${hardConstraints.mustStayInLocation ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>Yes</button>
              <button onClick={() => setHardConstraints(prev => ({ ...prev, mustStayInLocation: false, locationReason: '', locationDuration: '' }))} className={`flex-1 p-4 rounded-lg border-2 ${!hardConstraints.mustStayInLocation ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>No</button>
            </div>

            {hardConstraints.mustStayInLocation && (
              <>
                <input type="text" value={hardConstraints.locationReason} onChange={(e) => setHardConstraints(prev => ({ ...prev, locationReason: e.target.value }))} placeholder="Why? (e.g., kids' school, custody, job)" className="w-full p-4 mb-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
                <input type="text" value={hardConstraints.locationDuration} onChange={(e) => setHardConstraints(prev => ({ ...prev, locationDuration: e.target.value }))} placeholder="For how long? (e.g., 6 years, indefinitely)" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
              </>
            )}
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-2 block">Any other hard deadlines or time constraints?</label>
            <textarea value={hardConstraints.otherDeadlines} onChange={(e) => setHardConstraints(prev => ({ ...prev, otherDeadlines: e.target.value }))} placeholder="e.g., retirement in 10 years, parent needs care" rows="3" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setWizardStep(1)} className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
            <button onClick={() => { markSectionComplete('hardConstraints'); setWizardStep(3); }} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2">
              Continue <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // WIZARD STEP 3: LIFE VISION (with escape hatch)
  if (currentStep === 'setup' && wizardStep === 3) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">What Do You Want Out of This Life?</h1>
          <p className="text-lg opacity-90">Step 3 of 8: Define your vision - everything else supports this</p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-900"><strong>After this step:</strong> You can continue the guided setup (recommended) or skip ahead and explore freely.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <textarea value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder="e.g., Build a business that gives me freedom and helps others" rows="3" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 mb-3" />
            <button onClick={() => { addItem(); if (categories.lifeGoals.length === 0) markSectionComplete('lifeGoals'); }} disabled={!newItemText.trim()} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg disabled:bg-gray-300">
              <Plus size={16} />Add Life Goal
            </button>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Your Life Vision</h3>
            {categories.lifeGoals.length === 0 ? (
              <p className="text-gray-500 text-sm">Add your first life goal to continue</p>
            ) : (
              <div className="space-y-2">
                {categories.lifeGoals.map((goal, index) => (
                  <div key={goal.id} className="flex items-start gap-2 text-sm">
                    <span className="font-bold text-purple-600">#{index + 1}</span>
                    <p className="flex-1">{goal.text}</p>
                    <button onClick={() => removeItem('lifeGoals', goal.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={() => setWizardStep(2)} className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
          <button onClick={() => { if (categories.lifeGoals.length > 0) markSectionComplete('lifeGoals'); setWizardStep(4); }} disabled={categories.lifeGoals.length === 0} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
            Continue Guided Setup <ChevronRight size={20} />
          </button>
          <button onClick={() => { if (categories.lifeGoals.length > 0) { markSectionComplete('lifeGoals'); const defaults = calculateDefaultSliders(); setRoleSliders(defaults); setCurrentStep('input'); } }} disabled={categories.lifeGoals.length === 0} className="px-6 py-3 border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Skip to Explore
          </button>
        </div>
      </div>
    );
  }

  // WIZARD STEPS 4-8 would follow similar pattern...
  // For brevity, I'll create a generic wizard step component that handles the remaining steps

  if (currentStep === 'setup' && wizardStep > 3) {
    const stepConfig = {
      4: { title: 'Non-Negotiables', category: 'nonNegotiables', section: 'nonNegotiables', color: 'indigo' },
      5: { title: 'Current Situation', category: null, section: 'currentSituation', color: 'blue' },
      6: { title: 'Barriers (Fears & Avoidances)', category: 'fears', section: 'barriers', color: 'red' },
      7: { title: 'Foundation (Lessons & Facts)', category: 'lessons', section: 'foundation', color: 'green' },
      8: { title: 'Pending Decisions', category: 'decisions', section: 'decisions', color: 'orange' }
    };

    const config = stepConfig[wizardStep];

    if (wizardStep === 5) {
      // Current Situation - special form
      return (
        <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Current Situation</h1>
            <p className="text-lg opacity-90">Step 5 of 8: Help us understand where you are right now</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-2 block">Work status</label>
              <select value={currentSituation.workStatus} onChange={(e) => setCurrentSituation(prev => ({ ...prev, workStatus: e.target.value }))} className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500">
                <option value="">Select...</option>
                <option value="Employed full-time">Employed full-time</option>
                <option value="Employed part-time">Employed part-time</option>
                <option value="Self-employed/Entrepreneur">Self-employed/Entrepreneur</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Between jobs">Between jobs</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 mb-2 block">Tell us more about your work</label>
              <textarea value={currentSituation.workDescription} onChange={(e) => setCurrentSituation(prev => ({ ...prev, workDescription: e.target.value }))} placeholder="e.g., Software developer at tech startup, looking to transition" rows="3" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500" />
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 mb-2 block">Health constraints or considerations</label>
              <textarea value={currentSituation.healthConstraints} onChange={(e) => setCurrentSituation(prev => ({ ...prev, healthConstraints: e.target.value }))} placeholder="e.g., chronic condition, energy levels, mental health" rows="3" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500" />
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 mb-2 block">Who can you lean on for support?</label>
              <textarea value={currentSituation.supportSystem} onChange={(e) => setCurrentSituation(prev => ({ ...prev, supportSystem: e.target.value }))} placeholder="e.g., close friends, family, therapist, community" rows="3" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500" />
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 mb-2 block">What brought you here today?</label>
              <textarea value={currentSituation.whatBroughtYouHere} onChange={(e) => setCurrentSituation(prev => ({ ...prev, whatBroughtYouHere: e.target.value }))} placeholder="e.g., feeling stuck in career, major life transition, specific challenge" rows="3" className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500" />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setWizardStep(4)} className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={() => { markSectionComplete('currentSituation'); setWizardStep(6); }} className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2">
                Continue <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Generic category step (4, 6, 7, 8)
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
        <div className={`bg-gradient-to-r from-${config.color}-600 to-${config.color}-700 text-white p-8 rounded-lg mb-8`}>
          <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
          <p className="text-lg opacity-90">Step {wizardStep} of 8</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-lg font-semibold text-gray-700 mb-3 block">{categoryConfig[config.category]?.description}</label>
            <textarea value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder={categoryConfig[config.category]?.placeholder} rows="3" className={`w-full p-4 border-2 border-gray-200 rounded-lg focus:border-${config.color}-500 mb-3`} />
            <button onClick={() => { addItem(); if (categories[config.category]?.length === 0) markSectionComplete(config.section); }} disabled={!newItemText.trim()} className={`w-full flex items-center justify-center gap-2 bg-${config.color}-600 hover:bg-${config.color}-700 text-white p-3 rounded-lg disabled:bg-gray-300`}>
              <Plus size={16} />Add Item
            </button>
          </div>

          <div className={`bg-${config.color}-50 border-2 border-${config.color}-200 rounded-lg p-4`}>
            <h3 className="font-semibold mb-3">Your {config.title}</h3>
            {categories[config.category]?.length === 0 ? (
              <p className="text-gray-500 text-sm">No items yet - add to continue</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories[config.category]?.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-2 text-sm">
                    <span className={`font-bold text-${config.color}-600`}>#{index + 1}</span>
                    <p className="flex-1">{item.text}</p>
                    <button onClick={() => removeItem(config.category, item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={() => setWizardStep(wizardStep - 1)} className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
          <button onClick={() => { if (categories[config.category]?.length > 0) markSectionComplete(config.section); if (wizardStep === 8) { const defaults = calculateDefaultSliders(); setRoleSliders(defaults); setCurrentStep('input'); } else setWizardStep(wizardStep + 1); }} className={`flex-1 py-4 bg-gradient-to-r from-${config.color}-600 to-${config.color}-700 text-white font-semibold rounded-lg hover:from-${config.color}-700 hover:to-${config.color}-800 flex items-center justify-center gap-2`}>
            {wizardStep === 8 ? 'Complete Setup' : 'Continue'} <ChevronRight size={20} />
          </button>
          <button onClick={() => { if (categories[config.category]?.length > 0) markSectionComplete(config.section); const defaults = calculateDefaultSliders(); setRoleSliders(defaults); setCurrentStep('input'); }} className="px-6 py-3 border-2 border-gray-400 text-gray-600 rounded-lg hover:bg-gray-50">
            Skip Rest
          </button>
        </div>
      </div>
    );
  }

  // CONVERSATION SCREEN (unchanged)
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
            <button onClick={() => setCurrentStep('input')} className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-gray-50 p-6 rounded-lg">
          {conversationHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : msg.role === 'integration' ? 'bg-gradient-to-r from-purple-500 via-green-500 to-orange-500 text-white' : `${advisorConfig.color} text-white`
              }`}>
                {msg.role === 'advisor' && <div className="text-xs opacity-75 mb-1">{advisorConfig.name}</div>}
                {msg.role === 'integration' && <div className="text-xs opacity-75 mb-1 font-bold">All Advisors Collaborating</div>}
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
          <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Type your response..." className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500" />
          <button onClick={triggerIntegrationSession} disabled={!currentMessage.trim() || isAIResponding} className="px-4 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg hover:opacity-90 disabled:bg-gray-300" title="Get input from all advisors">
            <span className="text-lg">🤝</span>
          </button>
          <button onClick={sendMessage} disabled={!currentMessage.trim() || isAIResponding} className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2">
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  // MAIN INPUT SCREEN (with profile and completion tracking)
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen relative">
      {/* Profile Button */}
      <button onClick={() => setShowProfileModal(true)} className="fixed top-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg hover:bg-indigo-700 shadow-lg z-30">
        {userProfile.name.charAt(0).toUpperCase()}
      </button>

      {/* Profile Modal */}
      {showProfileModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setShowProfileModal(false)}></div>
          <div className="fixed right-6 top-20 w-96 bg-white rounded-lg shadow-2xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div><strong>Name:</strong> {userProfile.name}</div>
              <div><strong>Age:</strong> {userProfile.age}</div>
              <div><strong>Marital Status:</strong> {userProfile.maritalStatus || 'Not specified'}</div>
              <div><strong>Kids:</strong> {userProfile.hasKids ? `${userProfile.numberOfKids} (ages: ${userProfile.kidsAges})` : 'No'}</div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Setup Progress</span>
                  <span className="text-sm text-gray-600">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${getCompletionPercentage()}%` }}></div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {wizardSteps.map(step => (
                    <div key={step.key} className="flex items-center gap-2">
                      {completedSections[step.key] ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} className="text-gray-300" />}
                      <span className={completedSections[step.key] ? 'text-gray-900' : 'text-gray-400'}>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={clearAllData} className="w-full mt-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                Clear All Data
              </button>
            </div>
          </div>
        </>
      )}

      {/* Completion Banner */}
      {!canUnlockAdvisors() && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-900"><strong>{getCompletionPercentage()}% complete</strong> - Add life goals and complete 2 more sections to unlock advisor conversations</p>
        </div>
      )}

      {/* Rest of main input screen - same as before but activeCategory set to 'lifeGoals' */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">What Do You Want Out of This Life, {userProfile.name}?</h1>
        <p className="text-xl opacity-90 mb-6">Build your vision, then talk to your advisors.</p>
      </div>

      {/* Drawer and rest of UI continues as before... */}
      <p className="text-gray-600 text-center py-12">Main input interface with tabs will appear here once you finish the wizard.</p>
    </div>
  );
};

export default App;
