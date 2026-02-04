"use client";

import { useFormState } from "react-dom";
import type { ContactState } from "@/app/contact/actions";
import { submitContact } from "@/app/contact/actions";

const initialState: ContactState = { status: "idle", message: "" };

export default function ContactForm({
  labels
}: {
  labels: { name: string; email: string; message: string; submit: string };
}) {
  const [state, action] = useFormState(submitContact, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink-700" htmlFor="name">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-xl border border-sand-200 bg-white px-4 py-2 text-sm"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink-700" htmlFor="email">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-xl border border-sand-200 bg-white px-4 py-2 text-sm"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink-700" htmlFor="message">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="rounded-xl border border-sand-200 bg-white px-4 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        {labels.submit}
      </button>
      {state.status !== "idle" && (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-accent-600" : "text-rose-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
