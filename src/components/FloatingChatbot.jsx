import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getDB } from '../services/db';
import { askRecordsAssistant } from '../services/ai';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Bot, 
  User, 
  Loader2,
  ChevronDown
} from 'lucide-react';

export default function FloatingChatbot() {
  const { t, i18n } = useTranslation();
  const { currentUser, currentProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: i18n.language === 'ta'
        ? "வணக்கம்! நான் உங்கள் ஹெல்த் கோபைலட் உதவியாளர். உங்கள் பதிவேற்றப்பட்ட மருத்துவ ஆவணங்களின் அடிப்படையில் உங்கள் கேள்விகளுக்கு பதிலளிக்கிறேன். மருந்துகள் அல்லது ஆய்வக முடிவுகள் பற்றி என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?"
        : "Hello! I am your AI Health Copilot Assistant. I answer questions strictly based on your uploaded medical records. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientRecords, setPatientRecords] = useState([]);
  const messagesEndRef = useRef(null);

  // Load records for patient
  useEffect(() => {
    async function loadData() {
      if (currentUser && currentUser.role === 'patient') {
        const db = await getDB();
        const records = await db.getAllFromIndex('records', 'by_patient', currentUser.id);
        setPatientRecords(records || []);
      }
    }
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const responseText = await askRecordsAssistant({
        question: userText,
        patientRecords,
        patientProfile,
        language: i18n.language
      });

      const botMsg = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: i18n.language === 'ta'
          ? "மன்னிக்கவும், தகவலைப் பெறுவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
          : "Sorry, I encountered an issue retrieving that information. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = i18n.language === 'ta' ? [
    "என் தற்போதைய மருந்துகள் என்னென்ன?",
    "கடைசி பரிசோதனையில் சர்க்கரை அளவு எவ்வளவு?",
    "ஏதேனும் அசாதாரண முடிவுகள் உள்ளனவா?"
  ] : [
    "What are my current active medications?",
    "What was my last HbA1c / sugar reading?",
    "Are there any abnormal lab results?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 px-4 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse border-2 border-teal-600" />
          </div>
          <span className="font-semibold text-sm">Health Assistant</span>
        </button>
      )}

      {/* Expanded Chat Drawer / Modal */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-cyan-700 px-4 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-200" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{t('chat.title')}</h4>
                <p className="text-[11px] text-teal-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Grounded strictly in your records</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-teal-100 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Emergency Safety Banner */}
          <div className="bg-rose-50 border-b border-rose-200/80 px-3 py-1.5 text-[11px] text-rose-800 flex items-start space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-tight">
              Emergency symptoms? Call <strong className="font-bold underline">108 / 112</strong> immediately.
            </p>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${
                  m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-cyan-100 text-cyan-800'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-none'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs pl-2 py-1">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Analyzing medical history...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt quick pills */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(p);
                }}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-full transition border border-slate-200 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
