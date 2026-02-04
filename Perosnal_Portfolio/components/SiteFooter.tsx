export default function SiteFooter({ summary, note }: { summary: string; note: string }) {
  return (
    <footer className="border-t border-sand-200 bg-sand-100/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-ink-500">
        <p>{summary}</p>
        <p>{note}</p>
      </div>
    </footer>
  );
}
