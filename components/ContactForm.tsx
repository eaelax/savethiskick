'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-800 flex flex-col items-center text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[#53FC18] text-black font-bold flex items-center justify-center text-lg">
          ✓
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Received!</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md font-normal leading-relaxed">
          Thank you for reaching out to SaveThisKick support. Our team has received your message and will respond within 24 to 48 business hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-xs font-semibold text-slate-900 dark:text-[#53FC18] hover:underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex"
            className="w-full h-11 px-3.5 rounded-lg bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#53FC18]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Your Email
          </label>
          <input
            type="email"
            required
            placeholder="alex@example.com"
            className="w-full h-11 px-3.5 rounded-lg bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#53FC18]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Inquiry Subject
        </label>
        <select
          className="w-full h-11 px-3.5 rounded-lg bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#53FC18] cursor-pointer"
        >
          <option value="technical">Technical Support / Broken Kick VOD URL</option>
          <option value="dmca">DMCA / Copyright Inquiries</option>
          <option value="feedback">Feature Suggestion & Feedback</option>
          <option value="partnership">Business / Media Inquiries</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Kick VOD or Stream URL (Optional)
        </label>
        <input
          type="url"
          placeholder="https://kick.com/streamer/videos/..."
          className="w-full h-11 px-3.5 rounded-lg bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#53FC18]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Message / Details
        </label>
        <textarea
          required
          rows={4}
          placeholder="Provide as much context as possible (including any Kick URLs if relevant)..."
          className="w-full p-3.5 rounded-lg bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#53FC18]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 h-11 rounded-lg bg-[#53FC18] text-[#000000] font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center disabled:opacity-50"
      >
        <span>{loading ? 'Sending...' : 'Send Message'}</span>
      </button>
    </form>
  );
}
