"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="font-heading font-bold text-3xl text-gray-900 mt-8 mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-heading font-bold text-2xl text-gray-900 mt-8 mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-heading font-bold text-xl text-gray-900 mt-6 mb-2">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-4">
            {children}
          </p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[var(--club-primary)] underline hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-700 leading-relaxed">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[var(--club-primary)] pl-4 my-4 italic text-gray-500">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-200 rounded px-1.5 py-0.5 text-sm font-mono text-gray-700">
            {children}
          </code>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">{children}</strong>
        ),
        hr: () => <hr className="border-gray-300 my-8" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
