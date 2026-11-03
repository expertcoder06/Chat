/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChatWorkspace } from './components/ChatWorkspace';
import { RagConfigModal } from './components/RagConfigModal';
import { KnowledgeBaseExplorerModal } from './components/KnowledgeBaseExplorerModal';
import { EmbedCodeModal } from './components/EmbedCodeModal';
import { ChatMessage, RagBackendConfig } from './types/chat';
import { DEFAULT_RAG_CONFIG, queryRagPipeline } from './services/ragEngine';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aec_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [config, setConfig] = useState<RagBackendConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aec_rag_config');
      if (saved) {
        try {
          return { ...DEFAULT_RAG_CONFIG, ...JSON.parse(saved) };
        } catch {
          return DEFAULT_RAG_CONFIG;
        }
      }
    }
    return DEFAULT_RAG_CONFIG;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aec_chat_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isKnowledgeExplorerOpen, setIsKnowledgeExplorerOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);

  // Sync theme with html document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('aec_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('aec_theme', 'light');
    }
  }, [isDark]);

  // Persist config
  useEffect(() => {
    localStorage.setItem('aec_rag_config', JSON.stringify(config));
  }, [config]);

  // Persist chat messages
  useEffect(() => {
    localStorage.setItem('aec_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleToggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const handleSendMessage = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now()
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const { text, sources, latencyMs, tokensUsed } = await queryRagPipeline(
        trimmed,
        config,
        newHistory
      );

      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'assistant',
        text,
        timestamp: Date.now(),
        sources,
        latencyMs,
        tokensUsed
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `⚠️ Error communicating with RAG service: ${err.message || 'Unknown network error'}. Please verify your backend configuration in the settings panel.`,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your conversation?')) {
      setMessages([]);
      localStorage.removeItem('aec_chat_history');
    }
  };

  const handleFeedback = (messageId: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
    );
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200 overflow-hidden">
      {/* Standalone Pure Chatbot Interface (Upper navbar removed) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatWorkspace
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onOpenConfig={() => setIsConfigOpen(true)}
          onOpenKnowledgeExplorer={() => setIsKnowledgeExplorerOpen(true)}
          onOpenEmbedModal={() => setIsEmbedOpen(true)}
          isDark={isDark}
          onToggleDark={handleToggleDark}
          config={config}
          onFeedback={handleFeedback}
        />
      </main>

      {/* RAG & Vector DB Configuration Modal */}
      <RagConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={(updated) => setConfig(updated)}
      />

      {/* Knowledge Base & Vector Chunk Explorer Modal */}
      <KnowledgeBaseExplorerModal
        isOpen={isKnowledgeExplorerOpen}
        onClose={() => setIsKnowledgeExplorerOpen(false)}
        onSelectDocumentAsQuery={(query) => handleSendMessage(query)}
      />

      {/* Embed Code Modal for http://www.aecwb.edu.in */}
      <EmbedCodeModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
      />
    </div>
  );
}
