import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, MessageCircle, ArrowLeft, RotateCcw, User, MapPin, Calendar } from 'lucide-react';

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

  // Pre-loaded data - this will be the default data
  const defaultCategories = {
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
  const [activeCategory, setActiveCategory] = useState('avoiding');
  const [draggedItem, setDraggedItem] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  // Local storage for data persistence - but prioritize default data first
  useEffect(() => {
    const savedData = localStorage.getItem('breakthroughAppData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.userProfile && (parsed.userProfile.name || parsed.userProfile.age)) {
        setUserProfile(parsed.userProfile);
      }
      if (parsed.roleSliders) setRoleSliders(parsed.roleSliders);
      if (parsed.currentStep && parsed.userProfile && parsed.userProfile.name) {
        setCurrentStep(parsed.currentStep);
      }
      // Only load saved categories if they have actual content and user has been through setup
      if (parsed.categories && parsed.userProfile && parsed.userProfile.name && 
          Object.values(parsed.categories).some(cat => cat.length > 0)) {
        setCategories(parsed.categories);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      userProfile,
      roleSliders,
      categories,
      currentStep
    };
    localStorage.setItem('breakthroughAppData', JSON.stringify(dataToSave));
  }, [userProfile, roleSliders, categories, currentStep]);

  const categoryConfig = {
    avoiding: {
      title: "What are you avoiding?",
      placeholder: "e.g., Having a difficult conversation with my boss",
      description: "Things you're putting off, situations you're not facing"
    },
    fears: {
      title: "What are your fears?",
      placeholder: "e.g., Fear of financial instability",
      description: "Specific worries, anxieties, or concerns holding you back"
    },
    lessons: {
      title: "What did you learn last year?",
      placeholder: "e.g., I need to set better boundaries",
      description: "Growth, insights, lessons from recent experiences"
    },
    facts: {
      title: "Facts and Responsibilities",
      placeholder: "e.g., I have 2 kids, I need to earn $80k annually",
      description: "Non-negotiable realities in your life"
    },
    decisions: {
      title: "Decisions I need to make",
      placeholder: "e.g., Whether to change careers",
      description: "Specific choices or crossroads you're facing"
    },
    lifeGoals: {
      title: "What do you want out of this life?",
      placeholder: "e.g., Build a business that gives me freedom and helps others",
      description: "Your aspirations, dreams, and what success means to you"
    }
  };

  const roleConfig = {
    therapist: {
      name: "Therapist",
      description: "Emotional wellness & relationships",
      color: "bg-purple-500"
    },
    financialAdvisor: {
      name: "Financial Advisor", 
      description: "Money & financial strategy",
      color: "bg-green-500"
    },
    businessMentor: {
      name: "Business Mentor",
      description: "Career & professional growth", 
      color: "bg-blue-500"
    },
    father: {
      name: "Father Figure",
      description: "Wisdom & life guidance",
      color: "bg-orange-500"
    }
  };

  // Calculate smart defaults based on user profile
  const calculateDefaultSliders = () => {
    const age = parseInt(userProfile.age) || 25;
    
    if (age < 25) {
      return { therapist: 30, financialAdvisor: 20, businessMentor: 35, father: 15 };
    } else if (age < 35) {
      return { therapist: 25, financialAdvisor: 30, businessMentor: 30, father: 15 };
    } else if (age < 50) {
      return { therapist: 20, financialAdvisor: 35, businessMentor: 25, father: 20 };
    } else {
      return { therapist: 20, financialAdvisor: 30, businessMentor: 20, father: 30 };
    }
  };

  const handleSetupComplete = () => {
    const defaults = calculateDefaultSliders();
    setRoleSliders(defaults);
    setCurrentStep('input');
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: Date.now(),
      text: newItemText.trim()
    };
    
    setCategories(prev => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], newItem]
    }));
    
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
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.closest('.drag-zone')?.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.target.closest('.drag-zone')?.classList.remove('drag-over');
    }
  };

  const handleDrop = (e, categoryKey, dropIndex) => {
    e.preventDefault();
    e.target.closest('.drag-zone')?.classList.remove('drag-over');
    
    if (!draggedItem || draggedItem.categoryKey !== categoryKey) return;
    
    const items = [...categories[categoryKey]];
    const draggedItemData = items[draggedItem.itemIndex];
    
    items.splice(draggedItem.itemIndex, 1);
    const adjustedDropIndex = draggedItem.itemIndex < dropIndex ? dropIndex - 1 : dropIndex;
    items.splice(adjustedDropIndex, 0, draggedItemData);
    
    setCategories(prev => ({
      ...prev,
      [categoryKey]: items
    }));
    
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
      setCategories({
        avoiding: [],
        fears: [],
        lessons: [],
        facts: [],
        decisions: [],
        lifeGoals: []
      });
      setUserProfile({ name: '', age: '', location: '' });
      setCurrentStep('setup');
      setActiveCategory('avoiding');
      localStorage.removeItem('breakthroughAppData');
    }
  };

  const generateAIAnalysis = async () => {
    const userData = Object.entries(categories)
      .filter(([key, items]) => items.length > 0)
      .map(([category, items]) => ({
        category: categoryConfig[category].title,
        items: items.map((item, index) => ({
          text: item.text,
          rank: index + 1
        }))
      }));

    const lifeGoals = categories.lifeGoals.map(goal => goal.text).join('; ');
    
    const prompt = `You are an expert life coach analyzing breakthrough data. Provide personalized insights with ${roleSliders.therapist}% therapist perspective, ${roleSliders.financialAdvisor}% financial advisor perspective, ${roleSliders.businessMentor}% business mentor perspective, and ${roleSliders.father}% father figure perspective.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Location: ${userProfile.location}
- Life Goals: ${lifeGoals}

Ranked Data by Priority:
${userData.map(cat => 
  `${cat.category}:\n${cat.items.map(item => `${item.rank}. ${item.text}`).join('\n')}`
).join('\n\n')}

Please provide:
1. **Key Blockers**: Identify the 1-3 main things blocking success
2. **Role-Based Insights**: Weighted perspective from each role
3. **Goal-Aligned Action Plan**: Specific steps toward their life goals
4. **Integration Strategy**: How to address blockers while moving toward aspirations

Keep it personal, actionable, and focused on their stated life goals. Be direct but supportive.`;

    try {
      // Note: This is a placeholder for the API call
      // In production, this would go through a backend to protect the API key
      const response = await fetch('/api/openai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt,
          userProfile: userProfile,
          roleWeights: roleSliders
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      return result.analysis;
    } catch (error) {
      console.error('AI Analysis failed, using fallback:', error);
      return generateFallbackAnalysis();
    }
  };
  const generateFallbackAnalysis = () => {
    const lifeGoals = categories.lifeGoals.map(goal => goal.text).join('; ');
    const topItems = {};
    Object.entries(categories).forEach(([key, items]) => {
      if (items.length > 0) {
        topItems[key] = items[0].text;
      }
    });

    const analysis = [];
    
    analysis.push(`# ${userProfile.name}'s Multi-Perspective Breakthrough Analysis`);
    analysis.push("");
    
    // Life Goals Section
    if (categories.lifeGoals.length > 0) {
      analysis.push("## Your Life Vision");
      categories.lifeGoals.forEach((goal, index) => {
        analysis.push(`${index + 1}. ${goal.text}`);
      });
      analysis.push("");
    }

    // Key Blockers Analysis
    analysis.push("## Key Blockers Identified");
    const keyBlockers = [];
    
    if (topItems.avoiding && topItems.fears) {
      keyBlockers.push(`**Fear-Avoidance Cycle**: "${topItems.fears}" is driving avoidance of "${topItems.avoiding}"`);
    }
    
    if (topItems.lessons && topItems.avoiding) {
      keyBlockers.push(`**Knowledge-Action Gap**: You know "${topItems.lessons}" but still avoid "${topItems.avoiding}"`);
    }

    if (topItems.facts && topItems.lifeGoals) {
      keyBlockers.push(`**Reality-Dream Tension**: "${topItems.facts}" vs desired "${topItems.lifeGoals}"`);
    }

    keyBlockers.forEach(blocker => analysis.push(blocker));
    analysis.push("");

    // Role-Based Perspectives
    analysis.push("## Multi-Role Advisory Perspective");
    analysis.push("");

    if (roleSliders.therapist > 15) {
      analysis.push(`### Therapist Perspective (${roleSliders.therapist}%)`);
      analysis.push(`The fear "${topItems.fears || 'of unworthiness'}" creates emotional barriers. Your lesson "${topItems.lessons || 'about authenticity'}" shows growth capacity. Focus on self-compassion and challenging negative self-talk.`);
      analysis.push("");
    }

    if (roleSliders.financialAdvisor > 15) {
      analysis.push(`### Financial Advisor Perspective (${roleSliders.financialAdvisor}%)`);
      analysis.push(`With $800k assets and $60k debt, you have strong net worth but high income needs ($250k). Priority: address "${topItems.avoiding || 'financial planning'}" to align income with lifestyle goals.`);
      analysis.push("");
    }

    if (roleSliders.businessMentor > 15) {
      analysis.push(`### Business Mentor Perspective (${roleSliders.businessMentor}%)`);
      analysis.push(`"${topItems.lessons || 'Tech doesn\'t excite you'}" signals need for career pivot. Your avoidance of "${topItems.avoiding || 'learning new things'}" limits growth. Time to explore what truly energizes you professionally.`);
      analysis.push("");
    }

    if (roleSliders.father > 15) {
      analysis.push(`### Father Figure Perspective (${roleSliders.father}%)`);
      analysis.push(`Your kids need 6 more years near Briar Chapel - this is your anchor. Stop avoiding "${topItems.avoiding || 'family'}" and start building the community you want them to see. Model the authenticity you've learned.`);
      analysis.push("");
    }

    // Goal-Aligned Action Plan
    analysis.push("## Goal-Aligned Action Plan");
    analysis.push("");
    
    if (lifeGoals.includes("community")) {
      analysis.push("**Community Building**: Start with one local group - hiking, art, or athletic club. Your kids will benefit from seeing you engaged.");
    }
    
    if (lifeGoals.includes("financially stable")) {
      analysis.push("**Financial Stability**: Address the $250k income need through career transition planning while leveraging your $800k assets.");
    }
    
    if (lifeGoals.includes("close to my kids")) {
      analysis.push("**Family Connection**: Use the 6-year Briar Chapel timeline to deepen relationships rather than avoid family dynamics.");
    }

    analysis.push("");
    analysis.push("## Integration Strategy");
    analysis.push("");
    analysis.push("1. **Start Small**: Pick one avoided item and take one tiny step this week");
    analysis.push("2. **Leverage Strengths**: Use your meditation/writing practice for clarity on decisions");
    analysis.push("3. **Timeline Awareness**: Let your kids' needs guide location and community choices");
    analysis.push("4. **Authenticity Over Perfection**: You know 'you can be you' - lead with that truth");

    return analysis.join('\n');
  };

  const handleGetAnalysis = async () => {
    setIsGeneratingAnalysis(true);
    setCurrentStep('analysis');
    
    try {
      const result = await generateAIAnalysis();
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis generation failed:', error);
      const fallback = generateFallbackAnalysis();
      setAnalysis(fallback);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // Setup Screen
  if (currentStep === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Breakthrough Journey</h1>
          <p className="text-lg opacity-90">Let's start by getting to know you better</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <User size={20} />
              What's your name?
            </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your first name"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <Calendar size={20} />
              How old are you?
            </label>
            <input
              type="number"
              value={userProfile.age}
              onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Enter your age"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
              <MapPin size={20} />
              Where are you located?
            </label>
            <input
              type="text"
              value={userProfile.location}
              onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State/Country"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            />
          </div>

          <button
            onClick={handleSetupComplete}
            disabled={!userProfile.name || !userProfile.age || !userProfile.location}
            className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continue to Your Breakthrough Tool
          </button>
        </div>
      </div>
    );
  }

  // Analysis Screen
  if (currentStep === 'analysis') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Personalized Breakthrough Analysis</h1>
          <p className="opacity-90">Multi-perspective insights for {userProfile.name}</p>
        </div>

        {/* Role Sliders Display */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Perspective Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(roleConfig).map(([key, role]) => (
              <div key={key} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${role.color} flex items-center justify-center text-white font-bold text-lg mb-2`}>
                  {roleSliders[key]}%
                </div>
                <p className="text-sm font-medium">{role.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          {isGeneratingAnalysis ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your breakthrough data...</p>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setCurrentStep('input')}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Edit
          </button>
          <button 
            onClick={clearAllData}
            className="flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <RotateCcw size={16} />
            Start Over
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors no-print"
          >
            Print Analysis
          </button>
        </div>
      </div>
    );
  }

  // Main Input Screen
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Life Breakthrough Tool</h1>
        <p className="text-lg opacity-90">Welcome back, {userProfile.name}! Let's identify what's keeping you stuck.</p>
      </div>

      {/* Role Sliders */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Customize Your Advisory Team</h3>
        <p className="text-gray-600 mb-6">Adjust the balance of perspectives you want in your analysis:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(roleConfig).map(([key, role]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-medium text-gray-700">{role.name}</label>
                <span className="text-lg font-bold text-gray-800">{roleSliders[key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={roleSliders[key]}
                onChange={(e) => setRoleSliders(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-sm text-gray-500">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-t-lg transition-colors text-sm ${
              activeCategory === key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {config.title} ({categories[key].length})
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              {categoryConfig[activeCategory].title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {categoryConfig[activeCategory].description}
            </p>
            
            <div className="space-y-3">
              <textarea
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={categoryConfig[activeCategory].placeholder}
                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addItem();
                  }
                }}
              />
              
              <button 
                onClick={addItem}
                disabled={!newItemText.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-6 drag-zone">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Rank by Priority (drag to reorder)
              </h3>
              <span className="text-sm text-gray-500">
                Most important at top
              </span>
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
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, activeCategory, index)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border cursor-move hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-sm font-medium min-w-[20px]">
                        #{index + 1}
                      </span>
                      <GripVertical size={16} />
                    </div>
                    
                    <p className="flex-1 text-gray-800">{item.text}</p>
                    
                    <button
                      onClick={() => removeItem(activeCategory, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-all"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Ready for your multi-perspective breakthrough analysis?
            </h3>
            <p className="text-gray-600">
              You've added {getTotalItems()} items across all categories
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={loadDefaultData}
              className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              Load Demo Data
            </button>
            {getTotalItems() > 0 && (
              <button 
                onClick={clearAllData}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Start Over
              </button>
            )}
            <button 
              onClick={handleGetAnalysis}
              disabled={getTotalItems() === 0}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium"
            >
              Get My Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
