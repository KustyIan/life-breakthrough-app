import React, { useState } from 'react';
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
  const [categories, setCategories] = useState({
    avoiding: [],
    fears: [],
    lessons: [],
    facts: [],
    decisions: [],
    lifeGoals: []
  });
  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState('avoiding');
  const [draggedItem, setDraggedItem] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

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
      setCurrentStep('setup');
      setActiveCategory('avoiding');
    }
  };



  const generateFallbackAnalysis = () => {
    const topItems = {};
    Object.entries(categories).forEach(([key, items]) => {
      if (items.length > 0) {
        topItems[key] = items[0].text;
      }
    });

    const analysis = [];
    
    analysis.push(`# Breakthrough Analysis for ${userProfile.name}`);
    analysis.push("");
    
    if (categories.lifeGoals.length > 0) {
      analysis.push("## Your Life Vision");
      categories.lifeGoals.forEach((goal, index) => {
        analysis.push(`${index + 1}. ${goal.text}`);
      });
      analysis.push("");
    }

    analysis.push("## Key Blockers Identified");
    if (topItems.avoiding && topItems.fears) {
      analysis.push(`Your fear of "${topItems.fears}" is directly connected to avoiding "${topItems.avoiding}". This creates a cycle that prevents progress.`);
    }
    analysis.push("");

    analysis.push("## Multi-Role Perspective");
    if (roleSliders.therapist > 20) {
      analysis.push(`**Therapist View**: Your emotional patterns around "${topItems.fears || 'fear'}" need attention for breakthrough.`);
    }
    if (roleSliders.financialAdvisor > 20) {
      analysis.push(`**Financial Advisor**: Consider the financial implications of "${topItems.decisions || 'your decisions'}".`);
    }
    if (roleSliders.businessMentor > 20) {
      analysis.push(`**Business Mentor**: Professional growth requires addressing "${topItems.avoiding || 'avoidance patterns'}".`);
    }
    if (roleSliders.father > 20) {
      analysis.push(`**Father Figure**: Sometimes the hardest path forward is the right one. Time to face "${topItems.avoiding || 'what you\'ve been avoiding'}".`);
    }

    return analysis.join('\n');
  };

  const handleGetAnalysis = async () => {
    setIsGeneratingAnalysis(true);
    setCurrentStep('analysis');
    
    // For now, use fallback analysis (can integrate AI later)
    const result = generateFallbackAnalysis();
    setAnalysis(result);
    setIsGeneratingAnalysis(false);
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
