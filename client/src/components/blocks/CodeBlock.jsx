import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ language, text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button 
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            backgroundColor: 'transparent',
            fontSize: '0.95rem',
            lineHeight: '1.6',
          }}
        >
          {text}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
