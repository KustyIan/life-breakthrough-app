import React, { useState, useEffect } from 'react';
import { GripVertical, Trash2, MessageCircle, ArrowLeft, Send, ChevronRight, CheckCircle, Circle, X, ChevronDown, ChevronUp, Edit2, AlertCircle } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [wizardStep, setWizardStep] = useState(1);
  const [skipToExplore, setSkipToExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDiscoveryHelper, setShowDiscoveryHelper] = useState(false);
  const [showContext, setShowContext] = useState(true);
  
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
    savings: '',
    debt: '',
    locationFlexibility: 'anywhere',
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
  
  // Discovery answers
  const [discoveryAnswers, setDiscoveryAnswers] = useState({
    energizes: '',
    childhood: '',
    admire: '',
    noFail: '',
    anger: ''
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
  
  // Advisor mode state
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [customWeights, setCustomWeights] = useState({ 
    therapist: 25, 
    coach: 25, 
    financial: 25, 
    strategist: 25 
  });
  const [showModeSelector, setShowModeSelector] = useState(false);
  
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
      id: 'supervisor',
      name: 'Lead Advisor',
      description: 'Your strategic life coordinator',
      emoji: '🎯',
      gradient: 'from-indigo-500 to-purple-500',
      isDefault: true
    },
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
      emoji: '💪',
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

  const advisorModes = [
    { 
      id: 'balanced', 
      name: 'Balanced Perspective', 
      description: 'Equal blend of all advisors',
      weights: { therapist: 25, coach: 25, financial: 25, strategist: 25 }
    },
    { 
      id: 'tough-love', 
      name: 'Tough Love', 
      description: 'Direct coaching with strategic focus',
      weights: { therapist: 10, coach: 50, financial: 10, strategist: 30 }
    },
    { 
      id: 'gentle-support', 
      name: 'Gentle Support', 
      description: 'Emotional support with encouragement',
      weights: { therapist: 50, coach: 30, financial: 10, strategist: 10 }
    },
    { 
      id: 'practical', 
      name: 'Practical Focus', 
      description: 'Financial and strategic planning',
      weights: { therapist: 10, coach: 10, financial: 40, strategist: 40 }
    },
    { 
      id: 'custom', 
      name: 'Custom Blend', 
      description: 'Adjust the mix yourself',
      weights: { therapist: 25, coach: 25, financial: 25, strategist: 25 }
    }
  ];

  // Assessment Component
  const AssessmentScreen = () => {
    const getQualityScore = () => {
      let score = 0;
      let maxScore = 8;
      
      // Check completeness of each section
      if (lifeGoals.length > 100) score++;
      if (nonNegotiables.length > 50) score++;
      if (fears.length > 50) score++;
      if (lessons.length > 50) score++;
      if (decisions.length > 30) score++;
      if (hardConstraints.monthlyIncomeNeeded) score++;
      if (currentSituation.triggerReason?.length > 30) score++;
      if (currentSituation.workStatus) score++;
      
      return { score, maxScore, percentage: Math.round((score / maxScore) * 100) };
    };
    
    const { percentage } = getQualityScore();
    
    const missingAreas = [];
    if (!lifeGoals || lifeGoals.length < 50) missingAreas.push("Your life goals need more detail");
    if (!fears || fears.length < 30) missingAreas.push("Share more about what's holding you back");
    if (!currentSituation.triggerReason) missingAreas.push("Tell us what brought you here today");
    if (!hardConstraints.monthlyIncomeNeeded) missingAreas.push("Specify your financial needs");
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Your Life Breakthrough Assessment</h2>
            
            {/* Quality Score */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Information Quality</span>
                <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {percentage >= 80 ? "Excellent foundation for breakthrough work!" :
                 percentage >= 60 ? "Good start, but more detail will help advisors guide you better." :
                 "We need more information to provide effective guidance."}
              </p>
            </div>
            
            {/* Summary of What We Know */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">What we understand about you:</h3>
              <div className="space-y-2 text-sm">
                {hardConstraints.monthlyIncomeNeeded && hardConstraints.currentMonthlyIncome && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Income gap: ${parseInt(hardConstraints.monthlyIncomeNeeded) - parseInt(hardConstraints.currentMonthlyIncome)}/month to close</span>
                  </div>
                )}
                {lifeGoals && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{lifeGoals.split('\n').filter(g => g.trim()).length} life goals identified</span>
                  </div>
                )}
                {fears && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{fears.split('\n').filter(f => f.trim()).length} fears/barriers acknowledged</span>
                  </div>
                )}
                {decisions && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{decisions.split('\n').filter(d => d.trim()).length} pending decisions to resolve</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Areas Needing Attention */}
            {missingAreas.length > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  To maximize your breakthrough:
                </h3>
                <ul className="space-y-1 text-sm text-amber-800">
                  {missingAreas.map((area, idx) => (
                    <li key={idx}>• {area}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Key Questions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quick clarifying questions:</h3>
              <div className="space-y-3">
                {!currentSituation.triggerReason && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">What specific event or realization brought you here today?</p>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Got passed over for promotion, relationship ended..."
                      onChange={(e) => setCurrentSituation({...currentSituation, triggerReason: e.target.value})}
                    />
                  </div>
                )}
                {lifeGoals.split('\n').filter(g => g.trim()).length < 3 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">If you achieved everything, what would life look like in 5 years?</p>
                    <textarea 
                      className="w-full p-2 border rounded h-20"
                      placeholder="Describe your ideal day..."
                      onChange={(e) => setLifeGoals(lifeGoals + '\n' + e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssessment(false);
                  setCurrentStep('main');
                }}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
              >
                Start with Lead Advisor
              </button>
              <button
                onClick={() => {
                  setShowAssessment(false);
                  setWizardStep(1);
                  setCurrentStep('setup');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Refine Inputs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Discovery Helper Component
  const DiscoveryHelper = () => {
    const quickPrompts = [
      { emoji: '⏰', text: 'More control over my time and schedule' },
      { emoji: '💰', text: 'Financial freedom and security' },
      { emoji: '💕', text: 'Deeper, more meaningful relationships' },
      { emoji: '💪', text: 'Better health and more energy' },
      { emoji: '🎯', text: 'Work that feels meaningful and fulfilling' },
      { emoji: '🌍', text: 'Travel and new experiences' },
      { emoji: '🧘', text: 'Inner peace and less stress' },
      { emoji: '🚀', text: 'Build something of my own' },
      { emoji: '📚', text: 'Keep learning and growing' },
      { emoji: '🏡', text: 'A comfortable, beautiful home' },
      { emoji: '👨‍👩‍👧', text: 'More quality time with family' },
      { emoji: '🎨', text: 'Creative expression and artistic pursuits' },
      { emoji: '💡', text: 'Make a positive impact on others' },
      { emoji: '⚖️', text: 'Better work-life balance' }
    ];

    const deepQuestions = [
      {
        id: 'energizes',
        question: 'What activities make you lose track of time?',
        placeholder: 'When I\'m coding, writing, gardening, teaching others...'
      },
      {
        id: 'childhood',
        question: 'What did you dream about becoming as a child?',
        placeholder: 'I wanted to be an inventor, explorer, teacher...'
      },
      {
        id: 'admire',
        question: 'What do you admire in others\' lives?',
        placeholder: 'Their freedom to travel, their impact on community, their confidence...'
      },
      {
        id: 'noFail',
        question: 'What would you try if you knew you couldn\'t fail?',
        placeholder: 'Start a company, write a novel, move to another country...'
      },
      {
        id: 'anger',
        question: 'What problems in the world make you angry?',
        placeholder: 'Educational inequality, environmental destruction, loneliness epidemic...'
      }
    ];

    const addToLifeGoals = (text) => {
      const currentGoals = lifeGoals.trim();
      const newGoal = currentGoals ? `${currentGoals}\n${text}` : text;
      setLifeGoals(newGoal);
    };

    const generateGoalsFromAnswers = () => {
      let generated = [];
      
      if (discoveryAnswers.energizes) {
        generated.push(`Spend more time ${discoveryAnswers.energizes.toLowerCase()}`);
      }
      if (discoveryAnswers.childhood) {
        generated.push(`Reconnect with my childhood dream of ${discoveryAnswers.childhood.toLowerCase()}`);
      }
      if (discoveryAnswers.admire) {
        generated.push(`Create a life with ${discoveryAnswers.admire.toLowerCase()}`);
      }
      if (discoveryAnswers.noFail) {
        generated.push(`Have the courage to ${discoveryAnswers.noFail.toLowerCase()}`);
      }
      if (discoveryAnswers.anger) {
        generated.push(`Make a difference in ${discoveryAnswers.anger.toLowerCase()}`);
      }
      
      if (generated.length > 0) {
        const currentGoals = lifeGoals.trim();
        const newGoals = currentGoals ? `${currentGoals}\n${generated.join('\n')}` : generated.join('\n');
        setLifeGoals(newGoals);
        setShowDiscoveryHelper(false);
        setDiscoveryAnswers({ energizes: '', childhood: '', admire: '', noFail: '', anger: '' });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Discovery Helper</h2>
              <p className="text-sm text-gray-500">Let's figure out what you really want</p>
            </div>
            <button 
              onClick={() => setShowDiscoveryHelper(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Quick Starts - Click any that resonate:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      addToLifeGoals(prompt.text);
                    }}
                    className="text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center gap-2"
                  >
                    <span className="text-xl">{prompt.emoji}</span>
                    <span className="text-sm">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500 font-medium">OR EXPLORE DEEPER</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div>
              <h3 className="font-medium mb-3">Answer these questions to uncover hidden desires:</h3>
              <div className="space-y-4">
                {deepQuestions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium mb-1">{q.question}</label>
                    <textarea
                      value={discoveryAnswers[q.id]}
                      onChange={(e) => setDiscoveryAnswers({...discoveryAnswers, [q.id]: e.target.value})}
                      className="w-full p-3 border rounded-lg h-20 resize-none"
                      placeholder={q.placeholder}
                    />
                  </div>
                ))}
              </div>
              
              <button
                onClick={generateGoalsFromAnswers}
                disabled={!Object.values(discoveryAnswers).some(v => v.trim())}
                className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Life Goals from My Answers
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">💡 Tips for discovering what you want:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Don't overthink - go with your first instinct</li>
                <li>• Ignore what others expect from you</li>
                <li>• Think about what energizes vs drains you</li>
                <li>• Consider what you'd regret NOT doing</li>
                <li>• It's okay to want "simple" things like peace or freedom</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Context Panel for advisor chats
  const ContextPanel = () => {
    const getRelevantContext = () => {
      const context = {
        goals: lifeGoals.split('\n').filter(g => g.trim()).slice(0, 3),
        fears: fears.split('\n').filter(f => f.trim()).slice(0, 3),
        decisions: decisions.split('\n').filter(d => d.trim()).slice(0, 2)
      };
      return context;
    };
    
    const context = getRelevantContext();
    
    return (
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">Your Context</span>
          <button 
            onClick={() => setShowContext(!showContext)}
            className="text-blue-600 hover:text-blue-700"
          >
            {showContext ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {showContext && (
          <div className="space-y-2 text-xs">
            {context.goals.length > 0 && (
              <div>
                <span className="font-medium text-blue-800">Key Goals:</span>
                <ul className="mt-1 space-y-0.5">
                  {context.goals.map((goal, idx) => (
                    <li key={idx} className="text-blue-700">• {goal}</li>
                  ))}
                </ul>
              </div>
            )}
            {context.fears.length > 0 && (
              <div>
                <span className="font-medium text-blue-800">Main Fears:</span>
                <ul className="mt-1 space-y-0.5">
                  {context.fears.map((fear, idx) => (
                    <li key={idx} className="text-blue-700">• {fear}</li>
                  ))}
                </ul>
              </div>
            )}
            {context.decisions.length > 0 && (
              <div>
                <span className="font-medium text-blue-800">Pending:</span>
                <ul className="mt-1 space-y-0.5">
                  {context.decisions.map((decision, idx) => (
                    <li key={idx} className="text-blue-700">• {decision}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
          setCurrentStep('assessment');
          return;
        }
        break;
      default:
        sectionComplete = true;
    }
    
    if (sectionComplete) {
      if (wizardStep === 8) {
        setCurrentStep('assessment');
      } else {
        setWizardStep(wizardStep + 1);
      }
    }
  };

  const handleSkipToExplore = () => {
    setSkipToExplore(true);
    setCurrentStep('assessment');
  };

  const getCompletedCount = () => {
    return Object.values(completedSections).filter(v => v).length;
  };

  const canTalkToAdvisors = () => {
    return completedSections.lifeGoals && getCompletedCount() >= 3;
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentAdvisor(null);
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
      let initialMessage;
      
      if (advisorId === 'supervisor') {
        const mode = advisorModes.find(m => m.id === selectedMode);
        const goalCount = lifeGoals.split('\n').filter(g => g.trim()).length;
        const hasClarity = goalCount >= 3 && lifeGoals.length > 100;
        
        const clarityMessage = !hasClarity ? 
          `\n\nI notice you might still be exploring what you want from life. This is actually the most important work we can do together. Would you like me to help you discover your true desires? Just say "Help me get clear on what I want."` : '';
        
        initialMessage = {
          role: 'assistant',
          content: `Hello ${userName || 'there'}! I'm your Lead Advisor, here to coordinate your life breakthrough journey. I've reviewed everything you've shared - your goals, constraints, fears, and current situation. 
          
I'm currently in "${mode.name}" mode, which means ${mode.description.toLowerCase()}. You can change this anytime by clicking the mode selector above.

Based on what you've shared, I see a few key areas we should focus on:
${hardConstraints.monthlyIncomeNeeded && hardConstraints.currentMonthlyIncome && parseInt(hardConstraints.monthlyIncomeNeeded) > parseInt(hardConstraints.currentMonthlyIncome) ? `• There's a gap between your income needs ($${hardConstraints.monthlyIncomeNeeded}) and current income ($${hardConstraints.currentMonthlyIncome})` : ''}
${fears ? `• You're dealing with some significant fears that are holding you back` : ''}
${decisions ? `• You have important decisions pending that need clarity` : ''}
${lifeGoals ? `• You have ambitious life goals that need a strategic plan` : ''}

Where would you like to start? Or would you prefer I suggest a path forward?${clarityMessage}`
        };
      } else {
        initialMessage = {
          role: 'assistant',
          content: `Hello ${userName || 'there'}! I'm your ${advisor.name}. I've reviewed everything you've shared. ${
            advisor.id === 'therapist' ? "I notice you're dealing with some significant fears and challenges. Let's explore what's behind them." :
            advisor.id === 'coach' ? "You have some inspiring life goals! Let's create a concrete plan to achieve them." :
            advisor.id === 'financial' ? `I see you need $${hardConstraints.monthlyIncomeNeeded || '0'}/month with current savings of $${hardConstraints.savings || '0'} and debt of $${hardConstraints.debt || '0'}. Let's build a financial strategy that supports your life vision.` :
            "I can see the full picture of where you are and where you want to be. Let's create a strategic roadmap."
          } What would you like to focus on first?`
        };
      }
      
      setAdvisorMessages(prev => ({
        ...prev,
        [advisorId]: [initialMessage]
      }));
    }
  };

  // Auto-start supervisor conversation when advisors unlock
  useEffect(() => {
    if (currentStep === 'main' && canTalkToAdvisors() && !currentAdvisor && !Object.keys(advisorMessages).length) {
      startAdvisorConversation('supervisor');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

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
      const contextData = {
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
      };
      
      // Add mode and weights for supervisor
      if (currentAdvisor.id === 'supervisor') {
        const mode = advisorModes.find(m => m.id === selectedMode);
        contextData.advisorMode = selectedMode;
        contextData.advisorWeights = selectedMode === 'custom' ? customWeights : mode.weights;
      }
      
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextData)
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
                  <p className="text-sm text-gray-500">Location Flexibility</p>
                  <p className="font-medium">
                    {hardConstraints.locationFlexibility === 'anywhere' && 'Can move anywhere'}
                    {hardConstraints.locationFlexibility === 'within-hour' && 'Can move within 1 hour'}
                    {hardConstraints.locationFlexibility === 'within-30min' && 'Can move within 30 min'}
                    {hardConstraints.locationFlexibility === 'must-stay' && 'Must stay in current location'}
                  </p>
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
        
        {showDiscoveryHelper && <DiscoveryHelper />}
        
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Income Needed</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={hardConstraints.monthlyIncomeNeeded}
                        onChange={(e) => setHardConstraints({...hardConstraints, monthlyIncomeNeeded: e.target.value})}
                        className="w-full pl-8 pr-3 py-3 border rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Monthly Income</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={hardConstraints.currentMonthlyIncome}
                        onChange={(e) => setHardConstraints({...hardConstraints, currentMonthlyIncome: e.target.value})}
                        className="w-full pl-8 pr-3 py-3 border rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Savings</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={hardConstraints.savings}
                        onChange={(e) => setHardConstraints({...hardConstraints, savings: e.target.value})}
                        className="w-full pl-8 pr-3 py-3 border rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Debt</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        value={hardConstraints.debt}
                        onChange={(e) => setHardConstraints({...hardConstraints, debt: e.target.value})}
                        className="w-full pl-8 pr-3 py-3 border rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location Flexibility</label>
                  <select
                    value={hardConstraints.locationFlexibility}
                    onChange={(e) => setHardConstraints({...hardConstraints, locationFlexibility: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="anywhere">I can move anywhere</option>
                    <option value="within-hour">I can move up to 1 hour away</option>
                    <option value="within-30min">I can move up to 30 minutes away</option>
                    <option value="must-stay">I must stay in my current location</option>
                  </select>
                  
                  {hardConstraints.locationFlexibility !== 'anywhere' && (
                    <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-1">Why this constraint?</label>
                        <input
                          type="text"
                          value={hardConstraints.locationReason}
                          onChange={(e) => setHardConstraints({...hardConstraints, locationReason: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="e.g., kids' school, elderly parents, shared custody"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">For how long?</label>
                        <input
                          type="text"
                          value={hardConstraints.locationDuration}
                          onChange={(e) => setHardConstraints({...hardConstraints, locationDuration: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="e.g., 2 years, until kids graduate, indefinitely"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Other Time Constraints (optional)</label>
                  <textarea
                    value={hardConstraints.otherDeadlines}
                    onChange={(e) => setHardConstraints({...hardConstraints, otherDeadlines: e.target.value})}
                    className="w-full p-3 border rounded-lg h-20"
                    placeholder="Any other deadlines or time-sensitive constraints?"
                  />
                </div>
              </div>
            )}
            
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Life Vision</h2>
                <p className="text-gray-600">What do you want out of life? Dream big!</p>
                
                {/* Clarity Helper - Shows when goals are empty or very short */}
                {(!lifeGoals || lifeGoals.length < 50) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🧭</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900 mb-1">
                          Need help getting clear on what you want?
                        </p>
                        <p className="text-sm text-amber-700 mb-2">
                          Many people struggle with this - you're not alone! Our Discovery Helper can guide you.
                        </p>
                        <button 
                          onClick={() => setShowDiscoveryHelper(true)}
                          className="bg-amber-100 text-amber-900 hover:bg-amber-200 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                        >
                          Open Discovery Helper →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <textarea
                  value={lifeGoals}
                  onChange={(e) => setLifeGoals(e.target.value)}
                  className="w-full p-3 border rounded-lg h-48"
                  placeholder="Enter each goal on a new line...&#10;&#10;Examples:&#10;• Financial freedom by 45&#10;• Travel to 30 countries&#10;• Start my own business&#10;• Write a book"
                />
                
                {lifeGoals && lifeGoals.length > 50 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Great start! You can always refine these later with your Lead Advisor.
                    </p>
                  </div>
                )}
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex h-screen overflow-hidden">
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
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                  activeCategory === cat.id && !currentAdvisor ? `bg-${cat.color}-50 border-${cat.color}-200 border` : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{cat.label}</span>
                  <span className="text-sm text-gray-500">
                    ({cat.state.split('\n').filter(item => item.trim()).length})
                  </span>
                </div>
                {currentAdvisor && (
                  <Edit2 className="h-4 w-4 text-gray-400" />
                )}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-3">AI Advisors</h3>
            <div className="space-y-2">
              {/* Lead Advisor - Always available first */}
              {advisors.filter(a => a.isDefault).map(advisor => (
                <button
                  key={advisor.id}
                  onClick={() => startAdvisorConversation(advisor.id)}
                  disabled={!canTalkToAdvisors()}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    canTalkToAdvisors() 
                      ? 'hover:bg-gray-50 cursor-pointer ring-2 ring-indigo-200' 
                      : 'opacity-50 cursor-not-allowed'
                  } ${currentAdvisor?.id === advisor.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}`}
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
              
              {/* Divider */}
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-4 mb-2">Specialist Advisors</div>
              
              {/* Specialist Advisors */}
              {advisors.filter(a => !a.isDefault).map(advisor => (
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
        <div className="flex-1 flex flex-col h-screen">
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
          <div className="flex-1 overflow-hidden flex flex-col">
            {currentAdvisor ? (
              <>
                {/* Mode Selector for Supervisor */}
                {currentAdvisor.id === 'supervisor' && (
                  <div className="bg-white border-b px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">Advisor Mode: </span>
                        <button
                          onClick={() => setShowModeSelector(!showModeSelector)}
                          className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          {advisorModes.find(m => m.id === selectedMode)?.name} ▼
                        </button>
                      </div>
                      {selectedMode === 'custom' && (
                        <button
                          onClick={() => setShowModeSelector(true)}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Adjust Mix
                        </button>
                      )}
                    </div>
                    
                    {showModeSelector && (
                      <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border p-4 max-w-md">
                        <div className="space-y-3">
                          {advisorModes.map(mode => (
                            <button
                              key={mode.id}
                              onClick={() => {
                                setSelectedMode(mode.id);
                                if (mode.id !== 'custom') {
                                  setShowModeSelector(false);
                                }
                              }}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                selectedMode === mode.id ? 'bg-indigo-50 border-indigo-200 border' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="font-medium">{mode.name}</div>
                              <div className="text-sm text-gray-500">{mode.description}</div>
                            </button>
                          ))}
                        </div>
                        
                        {selectedMode === 'custom' && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            <div className="text-sm font-medium">Adjust Your Blend:</div>
                            {Object.entries(customWeights).map(([advisor, weight]) => (
                              <div key={advisor} className="flex items-center justify-between">
                                <span className="text-sm capitalize">{advisor}:</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={weight}
                                    onChange={(e) => {
                                      const newWeight = parseInt(e.target.value);
                                      setCustomWeights(prev => ({...prev, [advisor]: newWeight}));
                                    }}
                                    className="w-32"
                                  />
                                  <span className="text-sm w-10 text-right">{weight}%</span>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => setShowModeSelector(false)}
                              className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                            >
                              Apply Custom Blend
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Context Panel */}
                <ContextPanel />
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4 pb-20">
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
                
                {/* Fixed Input Area */}
                <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-white border-t p-4">
                  <div className="flex gap-2 max-w-4xl mx-auto">
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
              </>
            ) : (
              <div className="flex-1 overflow-auto p-4">
                {activeCategoryData ? (
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

  if (currentStep === 'assessment') {
    return <AssessmentScreen />;
  }
  
  if (currentStep === 'setup') {
    return renderWizardStep();
  }
  
  return renderMainApp();
};

export default App;
