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
      { id: 46, text: "I currently need to make 250k to bre
