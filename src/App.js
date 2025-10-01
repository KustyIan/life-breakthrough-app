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

  // Pre-loaded data
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
  const [activeCategory, setActiveCategory] = useState('lifeGoals');
  const [draggedItem, setDraggedItem] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [activeAdvisor, setActiveAdvisor] = useState(null);

  // Local storage for data persistence
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
      if (parsed.categories && parsed.userProfile && parsed.userProfile.name && 
          Object.values(parsed.categories).some(cat => cat.length > 0)) {
        setCategories(parsed.categories);
      }
      if (parsed.conversationHistory) setConversationHistory(parsed.conversationHistory);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      userProfile,
      roleSliders,
      categories,
      currentStep,
      conversationHistory
    };
    localStorage.setItem('breakthroughAppData', JSON.stringify(dataToSave));
  }, [userProfile, roleSliders, categories, currentStep, conversationHistory]);

  const categoryConfig = {
    lifeGoals: {
      title: "What do you want out of this life?",
      placeholder: "e.g., Build a business that gives me freedom and helps others",
      description: "Your aspirations, dreams, and what success means to you",
      priority: 1
    },
    avoiding: {
      title: "What are you avoiding?",
      placeholder: "e.g., Having a difficult conversation with my boss",
      description: "Things blocking your path to your life goals",
      priority: 2
    },
    fears: {
      title: "What are your fears?",
      placeholder: "e.g., Fear of financial instability",
      description: "What's holding you back from your vision",
      priority: 3
    },
    lessons: {
      title: "What did you learn last year?",
      placeholder: "e.g., I need to set better boundaries",
      description: "Resources you can use to reach your goals",
      priority: 4
    },
    facts: {
      title: "Facts and Responsibilities",
      placeholder: "e.g., I have 2 kids, I need to earn $80k annually",
      description: "Realities that shape your path forward",
      priority: 5
    },
    decisions: {
      title: "Decisions I need to make",
      placeholder: "e.g., Whether to change careers",
      description: "Choices that will move you toward your goals",
      priority: 6
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

  // Constrained slider handler - ensures all sliders sum to 100%
  const handleSliderChange = (changedRole, newValue) => {
    const currentTotal = Object.values(roleSliders).reduce((sum, val) => sum + val, 0);
    
    // Calculate how much to adjust other sliders
    const otherRoles = Object.keys(roleSliders).filter(role => role !== changedRole);
    const otherTotal = currentTotal - roleSliders[changedRole];
    
    const newSliders = { ...roleSliders, [changedRole]: newValue };
    
    // Distribute the difference proportionally across other sliders
    if (otherTotal > 0) {
      const remainingPercentage = 100 - newValue;
      otherRoles.forEach(role => {
        const proportion = roleSliders[role] / otherTotal;
        newSliders[role] = Math.max(0, Math.round(remainingPercentage * proportion));
      });
    } else {
      // If all others are 0, distribute equally
      const equalShare = Math.floor((100 - newValue) / otherRoles.length);
      otherRoles.forEach(role => {
        newSliders[role] = equalShare;
      });
    }
    
    // Ensure we're at exactly 100% (handle rounding)
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
      setActiveCategory('lifeGoals');
      setConversationHistory([]);
      localStorage.removeItem('breakthroughAppData');
    }
  };

  const startAdvisorConversation = (advisorRole) => {
    setActiveAdvisor(advisorRole);
    setCurrentStep('conversation');
    
    // Initial advisor greeting
    const greeting = generateAdvisorGreeting(advisorRole);
    setConversationHistory([{
      role: 'advisor',
      advisor: advisorRole,
      message: greeting,
      timestamp: new Date()
    }]);
  };

  const generateAdvisorGreeting = (advisorRole) => {
    const topGoal = categories.lifeGoals[0]?.text || "your life goals";
    
    const greetings = {
      therapist: `Hi ${userProfile.name}, I'm here to help you understand the emotional patterns that might be blocking you from "${topGoal}". Let's explore what's really going on beneath the surface. What feels most stuck right now?`,
