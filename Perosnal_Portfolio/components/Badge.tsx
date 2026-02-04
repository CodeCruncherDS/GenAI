export default function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-700">
      {label}
    </span>
  );
}
