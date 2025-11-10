'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder = '# 제목\n\n내용을 마크다운으로 작성하세요...' }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-300 bg-gray-50">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`px-4 py-2 font-medium transition-colors ${
            !isPreview
              ? 'bg-white border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          편집
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`px-4 py-2 font-medium transition-colors ${
            isPreview
              ? 'bg-white border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          미리보기
        </button>
      </div>

      {/* Content */}
      <div className="bg-white">
        {isPreview ? (
          <div className="p-6 min-h-[400px] markdown-content">
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">미리보기할 내용이 없습니다.</p>
            )}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full p-6 min-h-[400px] focus:outline-none resize-none font-mono text-sm"
          />
        )}
      </div>

      {/* Toolbar Tips */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>마크다운 문법을 사용할 수 있습니다</span>
          <div className="flex items-center space-x-4">
            <span># 제목</span>
            <span>**굵게**</span>
            <span>*기울임*</span>
            <span>`코드`</span>
            <span>[링크](url)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
