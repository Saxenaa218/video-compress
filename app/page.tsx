"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const defaultMarkdown = `# Welcome to Markdown Previewer!

## This is a sub-heading

Here's some regular text with **bold** and *italic* styling.

### Code Examples

Inline \`code\` looks like this.

\`\`\`javascript
// Code block example
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Lists

- Item 1
- Item 2
  - Nested item

1. First item
2. Second item

### Links and Images

[GitHub](https://github.com)

> This is a blockquote

---

That's all folks!
`;

const STORAGE_KEY = "markdown-content";

// Custom hook for localStorage with SSR support
function useLocalStorage(key: string, initialValue: string) {
  // Subscribe to localStorage changes
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  // Get snapshot from localStorage (client)
  const getSnapshot = useCallback(() => {
    return localStorage.getItem(key) ?? initialValue;
  }, [key, initialValue]);

  // Get snapshot for server-side rendering
  const getServerSnapshot = useCallback(() => {
    return initialValue;
  }, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback((newValue: string) => {
    localStorage.setItem(key, newValue);
    // Dispatch storage event to notify other components/tabs
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  }, [key]);

  return [value, setValue] as const;
}

// Custom hook for hydration-safe mounting
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Home() {
  const hasMounted = useHasMounted();
  const [storedMarkdown, setStoredMarkdown] = useLocalStorage(STORAGE_KEY, defaultMarkdown);
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Keep markdown state in sync with stored value on initial load
  const currentMarkdown = hasMounted ? storedMarkdown : defaultMarkdown;

  // Convert markdown to HTML
  useEffect(() => {
    if (!hasMounted) return;
    
    const convertMarkdown = async () => {
      const rawHtml = await marked(currentMarkdown, { gfm: true, breaks: true });
      // Sanitize HTML to prevent XSS attacks
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setHtml(sanitizedHtml);
    };
    
    convertMarkdown();
  }, [currentMarkdown, hasMounted]);

  // Handle markdown change
  const handleMarkdownChange = useCallback((newMarkdown: string) => {
    setStoredMarkdown(newMarkdown);
  }, [setStoredMarkdown]);

  // Copy HTML to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = html;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [html]);

  // Don't render until mounted to avoid hydration mismatch
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-100">
            Markdown Previewer
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-100">
          Markdown Previewer
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
          Enter GitHub flavored markdown and see the HTML preview in real-time.
          Your content is automatically saved to localStorage.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="markdown-input"
                className="text-lg font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Markdown Input
              </label>
            </div>
            <textarea
              id="markdown-input"
              value={currentMarkdown}
              onChange={(e) => handleMarkdownChange(e.target.value)}
              className="flex-1 min-h-[500px] p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your markdown here..."
            />
          </div>

          {/* HTML Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                HTML Preview
              </label>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {copied ? "Copied!" : "Copy HTML"}
              </button>
            </div>
            <div
              className="flex-1 min-h-[500px] p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 overflow-auto prose prose-zinc dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
