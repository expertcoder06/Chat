import React, { useState } from 'react';
import { X, Copy, Check, Code2, Globe } from 'lucide-react';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-chatbot-domain.com';

  const iframeSnippet = `<!-- Add this to http://www.aecwb.edu.in/ or any college page -->
<iframe
  src="${currentUrl}"
  width="100%"
  height="700"
  style="border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);"
  title="AEC Student AI Assistant"
  allow="microphone"
></iframe>`;

  const floatingWidgetSnippet = `<!-- Floating Chatbot Widget for AEC College Website -->
<script>
  (function() {
    var btn = document.createElement('button');
    btn.innerHTML = '<img src="${currentUrl}/assets/aistudio/image_782ebb6e.png" style="width:28px;height:28px;object-fit:contain;margin-right:8px;"/><span>Ask AEC AI</span>';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#800000;color:#fff;border:none;padding:12px 18px;border-radius:30px;font-weight:600;font-size:14px;box-shadow:0 8px 24px rgba(128,0,0,0.35);cursor:pointer;display:flex;align-items:center;';
    btn.onclick = function() {
      window.open('${currentUrl}', 'AecChatbot', 'width=480,height=720');
    };
    document.body.appendChild(btn);
  })();
</script>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-900 text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Embed Chatbot on College Website
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Easily integrate into http://www.aecwb.edu.in/
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Method 1: Iframe */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-800 dark:text-rose-400" />
                Option 1: Direct Full-Window Iframe
              </span>
              <button
                onClick={() => handleCopy(iframeSnippet, 'iframe')}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1 transition-colors"
              >
                {copiedType === 'iframe' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'iframe' ? 'Copied' : 'Copy Iframe'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
              <pre>{iframeSnippet}</pre>
            </div>
          </div>

          {/* Method 2: Floating Button Widget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-rose-800 dark:text-rose-400" />
                Option 2: Floating Launcher Widget
              </span>
              <button
                onClick={() => handleCopy(floatingWidgetSnippet, 'floating')}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1 transition-colors"
              >
                {copiedType === 'floating' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'floating' ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
              <pre>{floatingWidgetSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
