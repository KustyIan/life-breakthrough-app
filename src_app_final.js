import React, { useState } from 'react';
import { Plus, GripVertical, Trash2, MessageCircle, ArrowLeft, RotateCcw } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('input');
  const [categories, setCategories] = useState({
    avoiding: [],
    fears: [],
    lessons: [],
    facts: [],
    decisions: []
  });
  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState('avoiding');
  const [draggedItem, setDraggedItem] = useState(null);

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
    }
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
        decisions: []
      });
      setCurrentStep('input');
      setActiveCategory('avoiding');
    }
  };

  const generateAnalysis = () => {
    const analysis = [];
    
    const topItems = {};
    Object.entries(categories).forEach(([key, items]) => {
      if (items.length > 0) {
        topItems[key] = items[0].text;
      }
    });

    if (Object.keys(topItems).length > 0) {
      analysis.push("## Your Top Priorities");
      analysis.push("");
      Object.entries(topItems).forEach(([key, item]) => {
        analysis.push(`**${categoryConfig[key].title}:** ${item}`);
      });
      analysis.push("");
    }

    if (topItems.avoiding && topItems.fears) {
      analysis.push("## Key Pattern I Notice");
      analysis.push("");
      analysis.push(`Your top fear ("${topItems.fears}") seems connected to what you're most avoiding ("${topItems.avoiding}"). This suggests fear might be driving your avoidance.`);
      analysis.push("");
    }

    if (topItems.lessons) {
      analysis.push("## Applying Your Learning");
      analysis.push("");
      analysis.push(`Your most impactful lesson from last year was: "${topItems.lessons}". How might this lesson help you address your current challenges?`);
      analysis.push("");
    }

    if (topItems.facts && topItems.decisions) {
      analysis.push("## Reality Check");
      analysis.push("");
      analysis.push(`Your biggest responsibility ("${topItems.facts}") needs to be considered as you work on your most urgent decision ("${topItems.decisions}").`);
      analysis.push("");
    }

    analysis.push("## Suggested Next Steps");
    analysis.push("");
    if (topItems.avoiding) {
      analysis.push(`1. **Address your #1 avoidance:** Take one small step toward "${topItems.avoiding}" this week.`);
    }
    if (topItems.fears) {
      analysis.push(`2. **Question your #1 fear:** Ask yourself - is "${topItems.fears}" based on facts or assumptions?`);
    }
    if (topItems.decisions) {
      analysis.push(`3. **Make progress on your top decision:** What information do you need to move forward with "${topItems.decisions}"?`);
    }

    return analysis.join('\n');
  };

  if (currentStep === 'analysis') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Breakthrough Analysis</h1>
          <p className="opacity-90">Based on your priorities and rankings</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {generateAnalysis()}
            </div>
          </div>
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Life Breakthrough Tool</h1>
        <p className="text-lg opacity-90">Identify what's keeping you stuck and create your path forward</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeCategory === key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {config.title} ({categories[key].length})
          </button>
        ))}
      </div>

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

      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Ready for your breakthrough analysis?
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
                Clear All
              </button>
            )}
            <button 
              onClick={() => setCurrentStep('analysis')}
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