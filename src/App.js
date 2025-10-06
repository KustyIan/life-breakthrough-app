import React, { useState, useEffect } from 'react';
import { GripVertical, Trash2, MessageCircle, ArrowLeft, Send, ChevronRight, CheckCircle, Circle, X } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [wizardStep, setWizardStep] = useState(1);
  const [skipToExplore, setSkipToExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // User data
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [hasKids, setHasKids] = useState(false);
  const [kidsAges, setKidsAges] = useState('');
  
  // Hard constraints
  const [hardConstraints, setHardConstraints] = useState({
    monthlyIncomeNeeded: '',
    currentMonthlyIncome: '',
    savingsDebt: '',
    locationLocked: false,
    locationReason: '',
    locationDuration: '',
    otherDeadlines: ''
  });
  
  // Current situation
  const [currentSituation, setCurrentSituation] = useState({
    workStatus: '',
    workDescription: '',
    healthConstraints: '',
    energyLevel: '',
    supportSystem: '',
    triggerReason: ''
  });
  
  // Life categories
  const [lifeGoals, setLifeGoals] = useState('');
  const [nonNegotiables, setNonNegotiables] = useState('');
  const [fears, setFears] = useState('');
  const [lessons, setLessons] = useState('');
  const [facts, setFacts] = useState('');
  const [decisions, setDecisions] = useState('');
  
  // Advisor conversations
  const [activeCategory, setActiveCategory] = useState('life-goals');
  const [advisorMessages, setAdvisorMessages] = useState({});
  const [currentAdvisor, setCurrentAdvisor] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Drawer and drag state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  
  // Track completed sections
  const [completedSections, setCompletedSections] = useState({
    demographics: false,
    hardConstraints: false,
    lifeGoals: false,
    nonNegotiables: false,
    currentSituation: false,
    fears: false,
    lessons: false,
    decisions: false
  });

  const categories = [
    { id: 'life-goals', label: 'Life Goals', color: 'emerald', state: lifeGoals, setState: setLifeGoals },
    { id: 'non-negotiables', label: 'Non-Negotiables', color: 'red', state: nonNegotiables, setState: setNonNegotiables },
    { id: 'fears', label: 'Fears & Avoidances', color: 'purple', state: fears, setState: setFears },
    { id: 'lessons', label: 'Lessons & Facts', color: 'blue', state: lessons, setState: setLessons },
    { id: 'decisions', label: 'Pending Decisions', color: 'amber', state: decisions, setState: setDecisions }
  ];

  const advisors = [
    { 
      id: 'therapist',
      name: 'Therapist',
      description: 'For emotional support and clarity',
      emoji: '🧠',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'coach',
      name: 'Life Coach', 
      description: 'For motivation and goal-setting',
      emoji: '🎯',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'financial',
      name: 'Financial Advisor',
      description: 'For money and career decisions',
      emoji: '💰',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'strategist',
      name: 'Strategist',
      description: 'For planning and problem-solving',
      emoji: '♟️',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    const storedData = localStorage.getItem(`userData_${userName}`);
    if (storedData && userName) {
      const parsed = JSON.parse(storedData);
      setLifeGoals(parsed.lifeGoals || '');
      setNonNegotiables(parsed.nonNegotiables || '');
      setFears(parsed.fears || '');
      setLessons(parsed.lessons || '');
      setFacts(parsed.facts || '');
      setDecisions(parsed.decisions || '');
      setAdvisorMessages(parsed.advisorMessages || {});
      setCompletedSections(parsed.completedSections || {});
      setHardConstraints(parsed.hardConstraints || {});
      setCurrentSituation(parsed.currentSituation || {});
    }
  }, [userName]);

  useEffect(() => {
    if (userName && currentStep === 'main') {
      const userData = {
        lifeGoals,
        nonNegotiables,
        fears,
        lessons,
        facts,
        decisions,
        advisorMessages,
        completedSections,
        hardConstraints,
        currentSituation
      };
      localStorage.setItem(`userData_${userName}`, JSON.stringify(userData));
    }
  }, [lifeGoals, nonNegotiables, fears, lessons, facts, decisions, advisorMessages, completedSections, hardConstraints, currentSituation, userName, currentStep]);

  const handleWizardNext = () => {
    let sectionComplete = false;
    
    switch(wizardStep) {
      case 1:
        if (userName && userAge) {
          setCompletedSections(prev => ({ ...prev, demographics: true }));
          sectionComplete = true;
        }
        break;
      case 2:
        if (hardConstraints.monthlyIncomeNeeded) {
          setCompletedSections(prev => ({ ...prev, hardConstraints: true }));
          sectionComplete = true;
        }
        break;
      case 3:
        if (lifeGoals) {
          setCompletedSections(prev => ({ ...prev, lifeGoals: true }));
          sectionComplete = true;
        }
        break;
      case 4:
        if (nonNegotiables) {
          setCompletedSections(prev => ({ ...prev, nonNegotiables: true }));
          sectionComplete = true;
        }
        break;
      case 5:
        if (currentSituation.workStatus) {
          setCompletedSections(prev => ({ ...prev, currentSituation: true }));
          sectionComplete = true;
        }
        break;
      case 6:
        if (fears) {
          setCompletedSections(prev => ({ ...prev, fears: true }));
          sectionComplete = true;
        }
        break;
      case 7:
        if (lessons) {
          setCompletedSections(prev => ({ ...prev, lessons: true }));
          sectionComplete = true;
        }
        break;
      case 8:
        if (decisions) {
          setCompletedSections(prev => ({ ...prev, decisions: true }));
          sectionComplete = true;
          setCurrentStep('main');
          return;
        }
        break;
      default:
        sectionComplete = true;
    }
    
    if (sectionComplete) {
      if (wizardStep === 8) {
        setCurrentStep('main');
      } else {
        setWizardStep(wizardStep + 1);
      }
    }
  };

  const handleSkipToExplore = () => {
    setSkipToExplore(true);
    setCurrentStep('main');
  };

  const getCompletedCount = () => {
    return Object.values(completedSections).filter(v => v).length;
  };

  const canTalkToAdvisors = () => {
    return completedSections.lifeGoals && getCompletedCount() >= 3;
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    if (window.innerWidth < 768) {
      setDrawerOpen(false);
    }
  };

  const handleInputChange = (value) => {
    const category = categories.find(c => c.id === activeCategory);
    if (category) {
      category.setState(value);
    }
  };

  const handleDragStart = (e, item, index) => {
    setDraggedItem({ item, index, categoryId: activeCategory });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem && draggedItem.index !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.index === targetIndex) return;
    
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return;
    
    const items = category.state.split('\n').filter(item => item.trim());
    const [movedItem] = items.splice(draggedItem.index, 1);
    items.splice(targetIndex, 0, movedItem);
    category.setState(items.join('\n'));
    
    setDraggedItem(null);
    setDropTargetIndex(null);
  };

  const deleteItem = (index) => {
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return;
    
    const items = category.state.split('\n').filter(item => item.trim());
    items.splice(index, 1);
    category.setState(items.join('\n'));
  };

  const getTotalItems = () => {
    return categories.reduce((total, cat) => {
      const items = cat.state.split('\n').filter(item => item.trim());
      return total + items.length;
    }, 0);
  };

  const startAdvisorConversation = async (advisorId) => {
    const advisor = advisors.find(a => a.id === advisorId);
    if (!advisor) return;
    
    setCurrentAdvisor(advisor);
    setDrawerOpen(false);
    
    if (!advisorMessages[advisorId]) {
      const initialMessage = {
        role: 'assistant',
        content: `Hello ${userName || 'there'}! I'm your ${advisor.name}. I've reviewed everything you've shared. ${
          advisor.id === 'therapist' ? "I notice you're dealing with some significant fears and challenges. Let's explore what's behind them." :
          advisor.id === 'coach' ? "You have some inspiring life goals! Let's create a concrete plan to achieve them." :
          advisor.id === 'financial' ? `I see you need ${hardConstraints.monthlyIncomeNeeded || '0'}/month. Let's build a financial strategy that supports your life vision.` :
          "I can see the full picture of where you are and where you want to be. Let's create a strategic roadmap."
        } What would you like to focus on first?`
      };
      
      setAdvisorMessages(prev => ({
        ...prev,
        [advisorId]: [initialMessage]
      }));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentAdvisor || isLoading) return;
    
    const userMessage = {
      role: 'user',
      content: newMessage
    };
    
    setAdvisorMessages(prev => ({
      ...prev,
      [currentAdvisor.id]: [...(prev[currentAdvisor.id] || []), userMessage]
    }));
    
    setNewMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(advisorMessages[currentAdvisor.id] || []), userMessage],
          advisorType: currentAdvisor.id,
          context: {
            lifeGoals,
            nonNegotiables,
            fears,
            lessons,
            decisions,
            hardConstraints,
            currentSituation,
            userName
          }
        })
      });
      
      const data = await response.json();
      
      setAdvisorMessages(prev => ({
        ...prev,
        [currentAdvisor.id]: [...prev[currentAdvisor.id], {
          role: 'assistant',
          content: data.message
        }]
      }));
    } catch (error) {
      console.error('Error:', error);
      setAdvisorMessages(prev => ({
        ...prev,
        [currentAdvisor.id]: [...prev[currentAdvisor.id], {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment."
        }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderWizardStep = () => {
    const wizardSteps = [
      'Who You Are',
      'Hard Constraints',
      'Life Vision',
      'Non-Negotiables',
      'Current Situation',
      'Barriers',
      'Foundation',
      'Pending Decisions'
    ];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Profile</h2>
                <button onClick={() => setShowProfile(false)} className="p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{userName || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{userAge || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-medium capitalize">{maritalStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="font-medium">{Math.round((getCompletedCount() / 8) * 100)}%</p>
                </div>
                <div className="pt-4 space-y-2">
                  {Object.entries(completedSections).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-300" />
                      )}
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {wizardStep > 1 && (
                <button 
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-2xl font-bold">Life Breakthrough Setup</h1>
            </div>
            <button 
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold"
            >
              {userName ? userName[0].toUpperCase() : 'U'}
            </button>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {wizardStep} of 8</span>
              <span className="text-sm text-gray-500">{wizardSteps[wizardStep - 1]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${(wizardStep / 8) * 100}%` }}
              />
            </div>
          </div>
          
          {wizardStep === 3 && !skipToExplore && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                You can now continue with guided setup (recommended) or skip to explore freely.
                You'll need to complete Life Goals + 2 other sections to unlock advisors.
              </p>
              <button
                onClick={handleSkipToExplore}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Skip to explore freely →
              </button>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Who You Are</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="partnered">Partnered</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasKids}
                      onChange={(e) => setHasKids(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">I have children</span>
                  </label>
                  {hasKids && (
                    <input
                      type="text"
                      value={kidsAges}
                      onChange={(e) => setKidsAges(e.target.value)}
                      className="w-full p-3 border rounded-lg mt-2"
                      placeholder="Ages of children (e.g., 5, 8, 12)"
                    />
                  )}
                </div>
              </div>
            )}
            
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Hard Constraints</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Income Needed</label>
                  <input
                    type="number"
                    value={hardConstraints.monthlyIncomeNeeded}
                    onChange={(e) => setHardConstraints({...hardConstraints, monthlyIncomeNeeded: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$ per month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Monthly Income</label>
                  <input
                    type="number"
                    value={hardConstraints.currentMonthlyIncome}
                    onChange={(e) => setHardConstraints({...hardConstraints, currentMonthlyIncome: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="$ per month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Savings / Debt</label>
                  <input
                    type="text"
                    value={hardConstraints.savingsDebt}
                    onChange={(e) => setHardConstraints({...hardConstraints, savingsDebt: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., $10k savings, $5k debt"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hardConstraints.locationLocked}
                      onChange={(e) => setHardConstraints({...hardConstraints, locationLocked: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">I must stay in my current location</span>
                  </label>
                  {hardConstraints.locationLocked && (
                    <>
                      <input
                        type="text"
                        value={hardConstraints.locationReason}
                        onChange={(e) => setHardConstraints({...hardConstraints, locationReason: e.target.value})}
                        className="w-full p-3 border rounded-lg mt-2"
                        placeholder="Why? (e.g., kids' school, job, custody)"
                      />
                      <input
                        type="text"
                        value={hardConstraints.locationDuration}
                        onChange={(e) => setHardConstraints({...hardConstraints, locationDuration: e.target.value})}
                        className="w-full p-3 border rounded-lg mt-2"
                        placeholder="For how long? (e.g., 2 years, indefinitely)"
                      />
                    </>
                  )}
                </div>
              </div>
            )}
            
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Life Vision</h2>
                <p className="text-gray-600">What do you want out of life? Dream big!</p>
                <textarea
                  value={lifeGoals}
                  onChange={(e) => setLifeGoals(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48"
                  placeholder="Enter each goal on a new line...&#10;&#10;Examples:&#10;• Financial freedom by 45&#10;• Travel to 30 countries&#10;• Start my own business&#10;• Write a book"
                />
              </div>
            )}
            
            {wizardStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Non-Negotiables</h2>
                <p className="text-gray-600">What boundaries and values will you never compromise?</p>
                <textarea
                  value={nonNegotiables}
                  onChange={(e) => setNonNegotiables(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48"
                  placeholder="Enter each non-negotiable on a new line...&#10;&#10;Examples:&#10;• Time with family comes first&#10;• No work on weekends&#10;• Must maintain health&#10;• Ethical work only"
                />
              </div>
            )}
            
            {wizardStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Current Situation</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Work Status</label>
                  <select
                    value={currentSituation.workStatus}
                    onChange={(e) => setCurrentSituation({...currentSituation, workStatus: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select...</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="searching">Job Searching</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Health & Energy</label>
                  <input
                    type="text"
                    value={currentSituation.healthConstraints}
                    onChange={(e) => setCurrentSituation({...currentSituation, healthConstraints: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Any health conditions or energy limitations?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Support System</label>
                  <textarea
                    value={currentSituation.supportSystem}
                    onChange={(e) => setCurrentSituation({...currentSituation, supportSystem: e.target.value})}
                    className="w-full p-3 border rounded-lg h-24"
                    placeholder="Who can you lean on? (family, friends, mentors, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">What brought you here today?</label>
                  <textarea
                    value={currentSituation.triggerReason}
                    onChange={(e) => setCurrentSituation({...currentSituation, triggerReason: e.target.value})}
                    className="w-full p-3 border rounded-lg h-24"
                    placeholder="What's the immediate reason or trigger?"
                  />
                </div>
              </div>
            )}
            
            {wizardStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Barriers</h2>
                <p className="text-gray-600">What fears and obstacles are holding you back?</p>
                <textarea
                  value={fears}
                  onChange={(e) => setFears(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48"
                  placeholder="Enter each fear or thing you're avoiding on a new line...&#10;&#10;Examples:&#10;• Fear of failure&#10;• Confrontation with boss&#10;• Starting before I'm ready&#10;• What others will think"
                />
              </div>
            )}
            
            {wizardStep === 7 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Foundation</h2>
                <p className="text-gray-600">What lessons have you learned and facts do you know to be true?</p>
                <textarea
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48"
                  placeholder="Enter each lesson or fact on a new line...&#10;&#10;Examples:&#10;• Hard work always pays off eventually&#10;• Health is wealth&#10;• Relationships matter more than money&#10;• I'm good at problem-solving"
                />
              </div>
            )}
            
            {wizardStep === 8 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Pending Decisions</h2>
                <p className="text-gray-600">What decisions are you currently facing?</p>
                <textarea
                  value={decisions}
                  onChange={(e) => setDecisions(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48"
                  placeholder="Enter each decision on a new line...&#10;&#10;Examples:&#10;• Should I change careers?&#10;• Move to a new city?&#10;• Go back to school?&#10;• Start that side project?"
                />
              </div>
            )}
            
            <button
              onClick={handleWizardNext}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              {wizardStep === 8 ? 'Complete Setup' : 'Continue'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMainApp = () => {
    const activeCategoryData = categories.find(c => c.id === activeCategory);
    const items = activeCategoryData ? activeCategoryData.state.split('\n').filter(item => item.trim()) : [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
        {/* Drawer for mobile */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${drawerOpen ? 'block' : 'hidden'}`} onClick={() => setDrawerOpen(false)} />
        
        <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform lg:relative lg:transform-none ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Life Breakthrough</h2>
              <button onClick={() => setShowProfile(true)} className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                {userName ? userName[0].toUpperCase() : 'U'}
              </button>
            </div>
            {!canTalkToAdvisors() && (
              <p className="text-xs text-gray-500 mt-2">
                Complete {3 - getCompletedCount()} more sections to unlock advisors
              </p>
            )}
          </div>
          
          <div className="p-4 space-y-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  activeCategory === cat.id ? `bg-${cat.color}-50 border-${cat.color}-200 border` : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cat.label}</span>
                  <span className="text-sm text-gray-500">
                    {cat.state.split('\n').filter(item => item.trim()).length}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-3">AI Advisors</h3>
            <div className="space-y-2">
              {advisors.map(advisor => (
                <button
                  key={advisor.id}
                  onClick={() => startAdvisorConversation(advisor.id)}
                  disabled={!canTalkToAdvisors()}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    canTalkToAdvisors() 
                      ? 'hover:bg-gray-50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  } ${currentAdvisor?.id === advisor.id ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${advisor.gradient} flex items-center justify-center text-2xl`}>
                      {advisor.emoji}
                    </div>
                    <div>
                      <p className="font-medium">{advisor.name}</p>
                      <p className="text-xs text-gray-500">{advisor.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            
            <h1 className="text-lg font-semibold">
              {currentAdvisor ? `Talking with ${currentAdvisor.name}` : 
               activeCategoryData ? activeCategoryData.label : 'Select a category'}
            </h1>
            
            <div className="text-sm text-gray-500">
              {getTotalItems()} total items
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {currentAdvisor ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {(advisorMessages[currentAdvisor.id] || []).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg p-4 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white shadow-md'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white shadow-md p-4 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t p-4 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 p-3 border rounded-lg"
                      placeholder="Type your message..."
                      disabled={isLoading}
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={isLoading || !newMessage.trim()}
                      className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {activeCategory ? (
                  <>
                    <div className="mb-4">
                      <textarea
                        value={categories.find(c => c.id === activeCategory)?.state || ''}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="w-full h-32 p-3 border rounded-lg resize-none"
                        placeholder="Add items, one per line..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item, index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`p-3 bg-white rounded-lg shadow-sm flex items-center justify-between cursor-move ${
                            dropTargetIndex === index ? 'ring-2 ring-indigo-500' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span>{item}</span>
                          </div>
                          <button
                            onClick={() => deleteItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a category from the sidebar to start adding items</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 'setup') {
    return renderWizardStep();
  }
  
  return renderMainApp();
};

export default App;
