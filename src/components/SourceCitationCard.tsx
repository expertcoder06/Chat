import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';
import { RetrievedSource } from '../types/chat';

interface SourceCitationCardProps {
  sources: RetrievedSource[];
  latencyMs?: number;
}

export const SourceCitationCard: React.FC<SourceCitationCardProps> = ({ sources, latencyMs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!sources || sources.length === 0) return null;

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
      {/* Accordion trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {sources.length} RAG Source{sources.length > 1 ? 's' : ''} Retrieved
          </span>
          <span className="text-slate-400 dark:text-slate-500">·</span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            Top Match: {Math.round(sources[0].similarityScore * 100)}%
          </span>
          {latencyMs && (
            <>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono tabular-nums">{latencyMs}ms</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Chunks list */}
      {isExpanded && (
        <div className="mt-2 space-y-2 text-xs">
          {sources.map((source, index) => {
            const matchPercent = Math.round(source.similarityScore * 100);
            return (
              <div
                key={source.id || index}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate text-[11px]">
                        {source.documentTitle}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">/</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {source.pageOrSection}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      {matchPercent}% Score
                    </span>
                    <button
                      onClick={() => handleCopySnippet(source.id, source.snippet)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Copy source text"
                      aria-label="Copy source text"
                    >
                      {copiedId === source.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-3 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800">
                  {source.snippet}
                </p>

                {source.sourceUrl && (
                  <div className="mt-1.5 flex justify-end">
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-400 hover:underline"
                    >
                      <span>Official Reference</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
