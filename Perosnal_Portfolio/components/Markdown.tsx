import { markdownToHtml } from "@/lib/markdown";

export default function Markdown({ content }: { content: string }) {
  const html = markdownToHtml(content);
  return (
    <div
      className="prose prose-slate max-w-none prose-a:text-accent-600 prose-code:rounded prose-code:bg-sand-100 prose-code:px-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
