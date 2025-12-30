"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const customTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
  },
  ".cm-content": {
    fontFamily: "'Roboto Mono', monospace",
    padding: "16px",
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-line": {
    padding: "2px 0",
  },
  "&.cm-focused": {
    outline: "none",
  },
});

export default function MarkdownEditor({
  content,
  onChange,
  placeholder = "Start typing your markdown here...",
}: MarkdownEditorProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange]
  );

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      <CodeMirror
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          customTheme,
          EditorView.lineWrapping,
        ]}
        theme="light"
        className="h-full"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
        }}
      />
    </div>
  );
}
