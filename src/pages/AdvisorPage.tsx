import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { api } from '../services/api';
import { AdvisorResponse } from '../types';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ares';
  text: string;
  timestamp: string;
  advice?: AdvisorResponse;
}

export const AdvisorPage: React.FC = () => {
  const { activeMission, resources } = useMission();

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ares',
      text: 'Greetings Commander. I am ARES (Astronaut Resource Evaluation System), your mission advisory AI. I am continuously monitoring your life-support mass balances, battery state-of-charge, and space environmental risks. How may I assist your command decisions today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const presetQuestions = [
    'Why is my oxygen level decreasing?',
    'How can I conserve electrical power on Mars?',
    'Which life support resource should I prioritize right now?',
    'Is our colony ready for a high-energy radiation storm?',
    'What happens if I delay hydroponic food production?',
    'What tactical action should I take during a dust storm?',
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || !activeMission || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await api.askAdvisor(activeMission.id, questionText);
      if (res.success && res.advisor) {
        const aresMsg: ChatMessage = {
          id: `ares_${Date.now()}`,
          sender: 'ares',
          text: res.advisor.fullMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          advice: res.advisor,
        };
        setMessages((prev) => [...prev, aresMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ares_err_${Date.now()}`,
        sender: 'ares',
        text: 'ARES Neural Link experienced telemetry latency. Please verify backend communication and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const latestAdvice = messages
    .slice()
    .reverse()
    .find((m) => m.advice !== undefined)?.advice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header with AI Connection Pill */}
      <div className="border-b border-mars/30 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-mars tracking-widest font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Astronaut Resource Evaluation System
          </span>
          <h1 className="text-3xl font-display font-black text-hud-text tracking-wide">
            ARES — AI MISSION ADVISOR
          </h1>
          <p className="text-xs font-mono text-hud-muted mt-1">
            Real-time aerospace telemetry analysis, resource projections, and risk mitigation guidance.
          </p>
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center gap-2">
          {latestAdvice?.mode === 'AI_CONNECTED' ? (
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/50 shadow-hud-glow">
              <span className="w-2 h-2 rounded-full bg-hud-cyan animate-pulse" />
              GEMINI AI CONNECTED
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-hud-amber/20 text-hud-amber border border-hud-amber/50">
              <span className="w-2 h-2 rounded-full bg-hud-amber" />
              ARES RULE-BASED ADVISOR ACTIVE
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Conversation Stream */}
        <div className="lg:col-span-8 flex flex-col h-[600px] hud-panel rounded-2xl border border-hud-cyan/30 overflow-hidden shadow-panel">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-mars/20 border border-mars/50 flex items-center justify-center text-mars shrink-0 shadow-mars-glow">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs font-sans leading-relaxed ${
                      isUser
                        ? 'bg-hud-cyan/20 border border-hud-cyan/40 text-hud-text rounded-tr-none'
                        : 'bg-space-900/90 border border-space-700 text-hud-text rounded-tl-none shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono text-hud-muted">
                      <span className={isUser ? 'text-hud-cyan' : 'text-mars'}>
                        {isUser ? 'COMMANDER' : 'ARES ADVISORY SYSTEM'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Scientific insight badge if present in advice */}
                    {msg.advice?.scientificInsights && (
                      <div className="mt-3 pt-2.5 border-t border-space-700/80 text-[11px] font-sans text-hud-cyan/90 bg-space-950/40 p-2.5 rounded-lg border border-hud-cyan/20">
                        <span className="font-mono font-bold text-hud-cyan block mb-0.5">
                          NASA Aerospace Principle:
                        </span>
                        {msg.advice.scientificInsights}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-mars/20 border border-mars/50 flex items-center justify-center text-mars shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-space-900/80 border border-space-700 rounded-2xl px-4 py-2 text-xs font-mono text-hud-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mars animate-ping" />
                  ARES is analyzing life-support telemetry & calculating orbital vectors...
                </div>
              </div>
            )}
          </div>

          {/* Preset Question Chips */}
          <div className="px-4 py-2 bg-space-950/70 border-t border-space-800 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="text-[10px] font-mono uppercase text-hud-muted shrink-0">
              TACTICAL QUERIES:
            </span>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-space-850 hover:bg-space-750 text-hud-muted hover:text-hud-cyan border border-space-700 hover:border-hud-cyan/40 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuestion);
            }}
            className="p-3 bg-space-900/95 border-t border-hud-cyan/20 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Query ARES on life support, power trade-offs, or emergency advice..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 bg-space-950 border border-space-700 rounded-xl px-4 py-2.5 text-xs font-mono text-hud-text placeholder-hud-muted focus:outline-none focus:border-hud-cyan"
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="p-2.5 rounded-xl bg-mars hover:bg-mars-dark text-space-950 font-bold transition-all shadow-mars-glow disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic Situational Analysis Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Situation Analysis Card */}
          <div className="p-5 rounded-2xl hud-panel border border-hud-cyan/30 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-hud-cyan" />
              <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider">
                Current Situation Analysis
              </h3>
            </div>
            <p className="text-xs font-sans text-hud-text leading-relaxed bg-space-900/70 p-3 rounded-xl border border-space-800">
              {latestAdvice?.situationAnalysis ||
                `Sol ${activeMission?.currentDay}: Habitat mass balance nominal. Monitor power generation before advancing to next Sol.`}
            </p>
          </div>

          {/* Critical Risks Card */}
          <div className="p-5 rounded-2xl hud-panel border border-hud-red/30 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-hud-red" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Critical Risks Identified
              </h3>
            </div>

            <div className="space-y-2">
              {latestAdvice?.criticalRisks && latestAdvice.criticalRisks.length > 0 ? (
                latestAdvice.criticalRisks.map((risk, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-hud-panel-alert border border-hud-red/40 text-[11px] font-sans text-hud-text flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-hud-red shrink-0 mt-1.5" />
                    <span>{risk}</span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-lg bg-space-900 text-[11px] font-mono text-hud-green flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-hud-green" />
                  <span>No immediate critical life support failures flagged.</span>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Actions Card */}
          <div className="p-5 rounded-2xl hud-panel border border-hud-green/30 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-hud-green" />
              <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider">
                Tactical Recommendations
              </h3>
            </div>

            <div className="space-y-2">
              {latestAdvice?.recommendedActions && latestAdvice.recommendedActions.length > 0 ? (
                latestAdvice.recommendedActions.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-space-900/80 border border-hud-green/30 text-[11px] font-sans text-hud-text flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-hud-green shrink-0 mt-1.5" />
                    <span>{act}</span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-lg bg-space-900 text-[11px] font-mono text-hud-muted">
                  Awaiting commander telemetry queries.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
