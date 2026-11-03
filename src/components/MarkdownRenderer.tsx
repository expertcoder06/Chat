import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Lightweight, safe markdown formatter for chat responses
 * Handles headers, bold, bullet points, tables, code blocks, and links without heavy deps.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (keyPrefix: number) => {
    if (inTable && (tableHeader.length > 0 || tableRows.length > 0)) {
      elements.push(
        <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs text-left">
            {tableHeader.length > 0 && (
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                <tr>
                  {tableHeader.map((h, i) => (
                    <th key={i} className="px-3 py-2 whitespace-nowrap">
                      {renderInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-800/40' : ''}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {renderInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  const renderInlineFormatting = (text: string) => {
    // Basic link parsing [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(renderBoldAndCode(text.substring(lastIdx, match.index), `txt-${lastIdx}`));
      }
      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-700 dark:text-rose-400 font-medium underline underline-offset-2 hover:text-rose-900 dark:hover:text-rose-300"
        >
          {match[1]}
        </a>
      );
      lastIdx = linkRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(renderBoldAndCode(text.substring(lastIdx), `txt-${lastIdx}`));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderBoldAndCode = (text: string, keyPrefix: string): React.ReactNode => {
    // Parse bold **text** and inline `code`
    const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
    return tokens.map((tok, idx) => {
      if (tok.startsWith('**') && tok.endsWith('**')) {
        return <strong key={`${keyPrefix}-${idx}`} className="font-semibold text-slate-900 dark:text-slate-100">{tok.slice(2, -2)}</strong>;
      }
      if (tok.startsWith('`') && tok.endsWith('`')) {
        return <code key={`${keyPrefix}-${idx}`} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-rose-800 dark:text-rose-300 font-mono text-[11px]">{tok.slice(1, -1)}</code>;
      }
      return tok;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is a table row
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if separator line
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
      if (isSeparator) {
        inTable = true;
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable(i);
    }

    // Blank line
    if (!line) {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${i}`} className="text-sm font-bold text-rose-900 dark:text-rose-300 mt-3 mb-1.5 flex items-center gap-2">
          {renderInlineFormatting(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${i}`} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">
          {renderInlineFormatting(line.slice(3))}
        </h3>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
          <span className="text-rose-700 dark:text-rose-400 mt-1 shrink-0 font-bold">›</span>
          <div className="flex-1">{renderInlineFormatting(line.slice(2))}</div>
        </div>
      );
      continue;
    }

    // Numbered lists
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 my-1 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
          <span className="text-rose-800 dark:text-rose-400 font-mono text-xs font-bold mt-0.5 shrink-0">{numMatch[1]}.</span>
          <div className="flex-1">{renderInlineFormatting(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Italic note
    if (line.startsWith('*') && line.endsWith('*')) {
      elements.push(
        <p key={`it-${i}`} className="text-xs italic text-slate-500 dark:text-slate-400 my-1.5">
          {line.slice(1, -1)}
        </p>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1.5 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
        {renderInlineFormatting(line)}
      </p>
    );
  }

  flushTable(lines.length);

  return <div className="space-y-0.5">{elements}</div>;
};
