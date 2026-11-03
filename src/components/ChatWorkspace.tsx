import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Download,
  Database,
  Sliders,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Info,
  Sun,
  Moon
} from 'lucide-react';
import { ChatMessage, RagBackendConfig } from '../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceCitationCard } from './SourceCitationCard';
import { QUICK_PROMPT_CATEGORIES } from '../services/knowledgeBase';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onOpenConfig: () => void;
  onOpenKnowledgeExplorer: () => void;
  onOpenEmbedModal: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  config: RagBackendConfig;
  onFeedback: (messageId: string, rating: 'up' | 'down') => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onOpenConfig,
  onOpenKnowledgeExplorer,
  onOpenEmbedModal,
  isDark,
  onToggleDark,
  config,
  onFeedback
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge or type directly.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text to speech
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown symbols for speech
    const cleanText = text.replace(/[#*`_\[\]()|]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 1800);
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportChat = () => {
    const formatted = messages
      .map(
        (m) =>
          `### ${m.sender === 'user' ? 'Student' : 'AEC Assistant'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.text}\n\n`
      )
      .join('---\n\n');

    const blob = new Blob([`# Asansol Engineering College AI Assistant Transcript\n\n${formatted}`], {
      type: 'text/markdown'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aec-chat-transcript-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-w-5xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-3 overflow-hidden">
      {/* Unified Chatbot Header (Single Header) */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs mb-2 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src="/assets/aistudio/image_782ebb6e.png"
              alt="AEC Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
                Asansol Engineering College
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                RAG CHATBOT
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              <span className="flex items-center gap-1 truncate">
                <Database className="w-3 h-3 text-rose-700 shrink-0" />
                {config.mode === 'custom_api' ? (
                  <span className="font-mono text-[10px] sm:text-[11px] truncate max-w-[140px] sm:max-w-[220px]">
                    API: {config.customApiUrl} ({config.vectorDb})
                  </span>
                ) : (
                  <span className="truncate">Internal AEC Store ({config.topK} Chunks)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* KB Chunks Explorer */}
          <button
            onClick={onOpenKnowledgeExplorer}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            title="Inspect Vector DB chunks"
          >
            <Database className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            <span>Chunks</span>
          </button>

          {/* Embed snippet button */}
          <button
            onClick={onOpenEmbedModal}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            title="Get embed code for website"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            <span>Embed</span>
          </button>

          {/* Export conversation */}
          <button
            onClick={handleExportChat}
            disabled={messages.length === 0}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Export conversation as Markdown"
            aria-label="Export chat"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear conversation */}
          <button
            onClick={onClearChat}
            disabled={messages.length === 0}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleDark}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* RAG Settings / Backend Connection */}
          <button
            onClick={onOpenConfig}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
            title="Connect RAG Model & Vector DB Backend"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Backend</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                config.mode === 'custom_api' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-2 space-y-4">
        {messages.length === 0 ? (
          /* Empty State / Welcome Onboarding */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center shadow-xs">
              <img
                src="/assets/aistudio/image_782ebb6e.png"
                alt="AEC Logo"
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                How can I assist your AEC journey today?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Ask any question regarding admissions, WBJEE cutoff ranks, departments, fee structures, hostel life, campus placements, or MAKAUT exam schedules.
              </p>
            </div>

            {/* Quick Prompt Categorized Carousel */}
            <div className="w-full space-y-3">
              {/* Category tabs */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {QUICK_PROMPT_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategoryIdx(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedCategoryIdx === idx
                        ? 'bg-rose-900 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Questions in active category */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {QUICK_PROMPT_CATEGORIES[selectedCategoryIdx].questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(q)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-slate-700/90 text-xs text-slate-800 dark:text-slate-100 font-medium transition-all flex items-center justify-between group shadow-xs"
                  >
                    <span className="leading-snug">{q}</span>
                    <span className="text-rose-700 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Connected to Asansol Engineering College Verified Corpus (ESTD 1998)</span>
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="space-y-4 max-w-4xl mx-auto w-full">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isUser = message.sender === 'user';
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Bot Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0 flex items-center justify-center shadow-2xs mt-1">
                        <img
                          src="/assets/aistudio/image_782ebb6e.png"
                          alt="AEC Crest"
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Message Bubble Container */}
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-xs ${
                        isUser
                          ? 'bg-rose-900 text-white rounded-tr-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-tl-xs text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {/* Sender label and timestamp */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] opacity-75">
                        <span className="font-semibold">{isUser ? 'You (Student)' : 'AEC Knowledge Bot'}</span>
                        <span className="font-mono">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Content */}
                      {isUser ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      ) : (
                        <MarkdownRenderer content={message.text} />
                      )}

                      {/* RAG Sources Accordion */}
                      {!isUser && message.sources && message.sources.length > 0 && (
                        <SourceCitationCard sources={message.sources} latencyMs={message.latencyMs} />
                      )}

                      {/* Bot Message Action Bar */}
                      {!isUser && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopyMessage(message.id, message.text)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                              title="Copy answer"
                              aria-label="Copy answer"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Speak audio button */}
                            <button
                              onClick={() => handleToggleSpeech(message.id, message.text)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                              title={speakingMessageId === message.id ? 'Stop audio' : 'Listen to answer'}
                              aria-label="Listen to answer"
                            >
                              {speakingMessageId === message.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Thumbs Feedback */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 mr-1">Was this helpful?</span>
                            <button
                              onClick={() => onFeedback(message.id, 'up')}
                              className={`p-1 rounded transition-colors ${
                                message.feedback === 'up'
                                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Helpful"
                              aria-label="Helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onFeedback(message.id, 'down')}
                              className={`p-1 rounded transition-colors ${
                                message.feedback === 'down'
                                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Not helpful"
                              aria-label="Not helpful"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0 flex items-center justify-center shadow-2xs mt-1">
                  <img
                    src="/assets/aistudio/image_782ebb6e.png"
                    alt="AEC Crest"
                    className="w-6 h-6 object-contain animate-pulse"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-rose-700 animate-spin" />
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-rose-900 dark:text-rose-300">Retrieving Vector Chunks...</span>
                    <span className="block text-[11px] text-slate-400">Querying AEC campus knowledge base</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-2">
        {/* Quick Suggestion Pills above input if chat has started */}
        {messages.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Suggestions:
            </span>
            <button
              onClick={() => onSendMessage('What are the B.Tech CSE placement statistics and average package?')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors"
            >
              CSE Placements
            </button>
            <button
              onClick={() => onSendMessage('How are 4-year B.Tech semester fees paid?')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors"
            >
              Fee Schedule
            </button>
            <button
              onClick={() => onSendMessage('What are hostel accommodation and mess facilities?')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors"
            >
              Hostel Facilities
            </button>
            <button
              onClick={() => onSendMessage('What are MAKAUT Continuous Assessment (CA) and MAR points?')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors"
            >
              MAKAUT CA & MAR
            </button>
          </div>
        )}

        {/* Text Input Box */}
        <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md focus-within:border-rose-800 dark:focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-800/10 transition-all">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening to your question... (Speak now)'
                : 'Ask anything about AEC courses, admissions, cutoffs, placements, hostels...'
            }
            className="w-full pl-4 pr-24 py-3 text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none"
          />

          {/* Action buttons inside textarea */}
          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop voice input' : 'Voice input (Speech to text)'}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-xl bg-rose-900 hover:bg-rose-800 disabled:opacity-40 disabled:hover:bg-rose-900 text-white shadow-xs transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-1.5 px-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <a
            href="http://www.aecwb.edu.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            <span>aecwb.edu.in</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
