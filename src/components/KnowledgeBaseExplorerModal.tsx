import React, { useState } from 'react';
import { X, Search, FileText, Database, BookOpen, Layers } from 'lucide-react';
import { AEC_KNOWLEDGE_DOCS, KnowledgeDocument } from '../services/knowledgeBase';

interface KnowledgeBaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocumentAsQuery?: (title: string) => void;
}

export const KnowledgeBaseExplorerModal: React.FC<KnowledgeBaseExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectDocumentAsQuery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument>(AEC_KNOWLEDGE_DOCS[0]);

  if (!isOpen) return null;

  const filteredDocs = AEC_KNOWLEDGE_DOCS.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AEC Knowledge Base & Vector Chunk Explorer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official documents & syllabus chunks indexed for semantic vector search
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

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Document List */}
          <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter college documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-rose-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-rose-900 text-white font-medium shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-rose-200' : 'text-rose-800 dark:text-rose-400'}`}>
                        {doc.category}
                      </span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-rose-200' : 'text-slate-400'}`}>
                        {doc.keywords.length} tags
                      </span>
                    </div>
                    <p className="line-clamp-2 leading-snug">{doc.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Document Preview */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-white dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                  {selectedDoc.category} · {selectedDoc.section}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedDoc.title}
                </h4>
              </div>
              {onSelectDocumentAsQuery && (
                <button
                  onClick={() => {
                    onSelectDocumentAsQuery(`Summarize key details from ${selectedDoc.title}`);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shrink-0"
                >
                  Ask About This Document
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Indexed Document Content
                </h5>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {selectedDoc.content}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Associated Semantic Keywords
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-500">
          <span>{AEC_KNOWLEDGE_DOCS.length} Knowledge Documents Loaded</span>
          <button
            onClick={onClose}
            className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
