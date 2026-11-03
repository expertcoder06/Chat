import React, { useState } from 'react';
import { X, Server, Database, Code, Sliders, CheckCircle2, AlertTriangle, Copy, Check, RefreshCw } from 'lucide-react';
import { RagBackendConfig, BackendMode } from '../types/chat';
import { testCustomBackendConnection, generateApiExampleCode } from '../services/ragEngine';

interface RagConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RagBackendConfig;
  onSaveConfig: (updated: RagBackendConfig) => void;
}

export const RagConfigModal: React.FC<RagConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState<'connection' | 'rag_params' | 'python_code'>('connection');
  const [formData, setFormData] = useState<RagBackendConfig>({ ...config });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testCustomBackendConnection(formData);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection failed',
        latencyMs: 0
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig(formData);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  const handleCopyCode = () => {
    const code = generateApiExampleCode(formData);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center shadow-xs">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                RAG Backend & Vector DB Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your FastAPI, LangChain, or Chroma/Pinecone backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('connection')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'connection'
                ? 'border-rose-800 text-rose-900 dark:text-rose-400 dark:border-rose-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              API Connection
            </span>
          </button>
          <button
            onClick={() => setActiveTab('rag_params')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'rag_params'
                ? 'border-rose-800 text-rose-900 dark:text-rose-400 dark:border-rose-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Vector DB & Retrieval Parameters
            </span>
          </button>
          <button
            onClick={() => setActiveTab('python_code')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'python_code'
                ? 'border-rose-800 text-rose-900 dark:text-rose-400 dark:border-rose-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              Python / FastAPI Starter Code
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* TAB 1: Connection */}
          {activeTab === 'connection' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Backend Execution Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, mode: 'mock_local' })}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      formData.mode === 'mock_local'
                        ? 'border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-rose-700" />
                      <span className="font-bold text-xs">Internal AEC Knowledge Engine</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Runs locally with authentic AEC prospectus, admissions data, fees, and MAKAUT rules. Zero setup required.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, mode: 'custom_api' })}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      formData.mode === 'custom_api'
                        ? 'border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Server className="w-4 h-4 text-rose-700" />
                      <span className="font-bold text-xs">Custom RAG Microservice</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Connect your own FastAPI, Flask, LangChain, or Flowise server hosting your LLM + Vector DB.
                    </p>
                  </div>
                </div>
              </div>

              {formData.mode === 'custom_api' ? (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Custom Endpoint URL (POST)
                    </label>
                    <input
                      type="url"
                      value={formData.customApiUrl}
                      onChange={(e) => setFormData({ ...formData, customApiUrl: e.target.value })}
                      placeholder="http://localhost:8000/api/rag-chat"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Expected JSON payload: <code>{'{ "query": string, "top_k": int, "collection_name": string }'}</code>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        API Key / Bearer Token (Optional)
                      </label>
                      <input
                        type="password"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Request Timeout (Seconds)
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="60"
                        value={formData.timeoutSeconds}
                        onChange={(e) => setFormData({ ...formData, timeoutSeconds: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                      />
                    </div>
                  </div>

                  {/* Test Connection Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-700" />
                          Testing Endpoint...
                        </>
                      ) : (
                        <>
                          <Server className="w-3.5 h-3.5" />
                          Ping & Test Connection
                        </>
                      )}
                    </button>

                    {testResult && (
                      <div
                        className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                          testResult.success
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {testResult.success ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        )}
                        <div>
                          <p className="font-semibold">{testResult.message}</p>
                          {!testResult.success && (
                            <p className="text-[11px] mt-0.5 opacity-90">
                              Tip: Ensure your FastAPI/Flask app is running with CORS enabled. Refer to the 'Python Starter Code' tab.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Internal Knowledge Store Ready
                  </div>
                  <p>
                    The chatbot will run using the embedded Asansol Engineering College information repository (Admissions, Branches, Seats, Fees, Hostels, T&P Placements, MAKAUT syllabus).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Vector DB Parameters */}
          {activeTab === 'rag_params' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vector Database Target
                  </label>
                  <select
                    value={formData.vectorDb}
                    onChange={(e) => setFormData({ ...formData, vectorDb: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                  >
                    <option value="chroma">ChromaDB (Local / Client)</option>
                    <option value="pinecone">Pinecone Vector Cloud</option>
                    <option value="qdrant">Qdrant Vector Engine</option>
                    <option value="faiss">FAISS (Facebook AI Similarity)</option>
                    <option value="weaviate">Weaviate Knowledge Graph</option>
                    <option value="pgvector">PostgreSQL (pgvector)</option>
                    <option value="custom">Custom Vector DB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Collection / Index Name
                  </label>
                  <input
                    type="text"
                    value={formData.collectionName}
                    onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                  />
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Top-K Retrieved Context Chunks</span>
                    <span className="font-mono text-rose-800 dark:text-rose-400">{formData.topK} Chunks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={formData.topK}
                    onChange={(e) => setFormData({ ...formData, topK: Number(e.target.value) })}
                    className="w-full accent-rose-800"
                  />
                  <p className="text-[11px] text-slate-500">Number of text chunks retrieved per student question.</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Similarity Threshold (Cosine Distance)</span>
                    <span className="font-mono text-rose-800 dark:text-rose-400">{formData.similarityThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={formData.similarityThreshold}
                    onChange={(e) => setFormData({ ...formData, similarityThreshold: Number(e.target.value) })}
                    className="w-full accent-rose-800"
                  />
                  <p className="text-[11px] text-slate-500">Minimum vector relevance score for inclusion in LLM prompt.</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>LLM Temperature</span>
                    <span className="font-mono text-rose-800 dark:text-rose-400">{formData.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                    className="w-full accent-rose-800"
                  />
                  <p className="text-[11px] text-slate-500">Lower values (0.1–0.3) provide grounded, factual responses.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  System Prompt Context Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Python / FastAPI code */}
          {activeTab === 'python_code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ready-to-run FastAPI microservice boilerplate configured for this frontend:
                </p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 text-xs font-medium text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-md hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Python Code'}</span>
                </button>
              </div>

              <div className="relative rounded-lg bg-slate-950 p-3.5 border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 max-h-72">
                <pre>{generateApiExampleCode(formData)}</pre>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-1">How to run locally:</p>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                  <li>Save this file as <code>main.py</code></li>
                  <li>Run <code>pip install fastapi uvicorn langchain chromadb</code></li>
                  <li>Start server: <code>uvicorn main:app --reload --port 8000</code></li>
                  <li>Set Endpoint URL in tab 1 to <code>http://localhost:8000/api/rag-chat</code></li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="text-xs text-slate-500">
            {savedAlert && <span className="text-emerald-600 font-semibold flex items-center gap-1">✓ Settings Saved</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg shadow-xs transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
