"use client";

import { useMemo, useState } from "react";

type DemoKey = "signal-meter" | "decision-timer";

export type DemoConfigMap = {
  "signal-meter": {
    title: string;
    highLabel: string;
    balancedLabel: string;
    lowLabel: string;
    caption: string;
  };
  "decision-timer": {
    title: string;
    resetLabel: string;
    options: number[];
    caption: string;
  };
};

export default function PersonalProjectDemo({
  demo,
  config,
  fallbackMessage
}: {
  demo: string;
  config: DemoConfigMap;
  fallbackMessage: string;
}) {
  const Component = useMemo(() => {
    if (demo === "signal-meter") {
      return SignalMeter;
    }
    if (demo === "decision-timer") {
      return DecisionTimer;
    }
    return null;
  }, [demo]);

  if (!Component) {
    return (
      <div className="rounded-2xl border border-sand-200 bg-sand-100 p-6 text-sm text-ink-600">
        {fallbackMessage}
      </div>
    );
  }

  return <Component config={config[demo as DemoKey]} />;
}

function SignalMeter({ config }: { config: DemoConfigMap["signal-meter"] }) {
  const [signal, setSignal] = useState(42);
  const label = signal > 70 ? config.highLabel : signal > 40 ? config.balancedLabel : config.lowLabel;

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">{config.title}</p>
          <p className="text-2xl font-display text-ink-900">{label}</p>
        </div>
        <span className="text-3xl font-semibold text-accent-600">{signal}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={signal}
        onChange={(event) => setSignal(Number(event.target.value))}
        className="mt-6 w-full accent-accent-500"
      />
      <p className="mt-2 text-xs text-ink-500">{config.caption}</p>
    </div>
  );
}

function DecisionTimer({ config }: { config: DemoConfigMap["decision-timer"] }) {
  const [seconds, setSeconds] = useState(config.options[0] ?? 25);

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">{config.title}</p>
          <p className="text-2xl font-display text-ink-900">{seconds}s</p>
        </div>
        <button
          type="button"
          onClick={() => setSeconds(config.options[0] ?? 25)}
          className="rounded-full border border-sand-200 px-4 py-2 text-xs font-semibold text-ink-700"
        >
          {config.resetLabel}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {config.options.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => setSeconds(value)}
            className={`rounded-xl border px-3 py-2 font-semibold transition ${
              seconds === value ? "border-accent-500 bg-accent-500 text-white" : "border-sand-200 bg-sand-50"
            }`}
          >
            {value}s
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-500">{config.caption}</p>
    </div>
  );
}
