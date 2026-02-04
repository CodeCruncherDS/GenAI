"use client";
import { useState } from "react";
import { ask } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chat() {
  const [project, setProject] = useState("default");
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSend() {
    const question = q.trim();
    if (!question || loading) return;
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setQ("");
    setLoading(true);
    try {
      const res = await ask({ question, project });
      setMsgs((m) => [...m, { role: "assistant", text: res.answer }]);
      (window as any).__lastSources = res.sources;
      window.dispatchEvent(new Event("sources:update"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[70vh] flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-neutral-600">Project</label>
        <input value={project} onChange={(e) => setProject(e.target.value)} className="w-40 rounded border px-2 py-1 text-sm" />
      </div>

      <div className="flex-1 overflow-auto rounded border bg-white p-3">
        <div className="flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}>
              <div className={`rounded-lg border px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-blue-50 border-blue-100" : "bg-white border-neutral-200"}`}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">{m.role}</div>
                {m.role === "assistant" ? (
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{m.text}</div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-neutral-500 animate-pulse">Thinking…</div>}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? onSend() : null)}
          className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Ask about endpoints, params, auth, examples…"
        />
        <button onClick={onSend} className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800">Send</button>
      </div>
    </div>
  );
}
