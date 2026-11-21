import React, { useState } from 'react';
import { Check, Copy, Mail, Send } from 'lucide-react';
import { SITE_IDENTITY } from '../data/universeData';
import {
  buildMailtoHref,
  ContactFormInput,
  validateContactForm,
} from '../utils/portfolioLogic';
import { ChapterHeader } from '../components/JourneyLine';

const TOPICS = [
  'ClassApp Feedback or Inquiry',
  'MilkyPy Learning Inquiry',
  'Ishizaki Tech Services Collaboration',
  'General Question',
];

export function ContactPage() {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    topic: TOPICS[0],
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [submittedHref, setSubmittedHref] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_IDENTITY.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked in restricted contexts; mailto link remains visible
    }
  };

  const handleCopyFullDraft = async () => {
    const draftText = [
      `To: ${SITE_IDENTITY.email}`,
      `Subject: [J/UNIVERSE] ${form.topic.trim()} — from ${form.name.trim()}`,
      '',
      form.message.trim(),
      '',
      `Reply-to: ${form.name.trim()} <${form.email.trim()}>`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(draftText);
      setCopiedDraft(true);
      window.setTimeout(() => setCopiedDraft(false), 2500);
    } catch {
      // Clipboard blocked in restricted contexts
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmittedHref(null);
      return;
    }

    setErrors({});
    const href = buildMailtoHref(form);
    setSubmittedHref(href);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-12">
      <ChapterHeader
        as="h1"
        chapter="Connect"
        title="Have an idea worth building?"
        subtitle="Reach out directly to Johnson Bediako Ametsitsi or Ishizaki Tech Services."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Direct Contact Column */}
        <aside className="lg:col-span-5 rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-7 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Direct Contact
            </h2>
            <p className="text-sm text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              Reach {SITE_IDENTITY.owner} ({SITE_IDENTITY.location}) for questions about ClassApp, MilkyPy, or {SITE_IDENTITY.studio}.
            </p>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-5 space-y-3">
            <p className="text-xs font-semibold text-[#4D5363] dark:text-[#A9B1C2]">
              Email
            </p>
            <div className="flex items-center gap-2 text-sm font-mono text-[#080B12] dark:text-[#F3F0E9] break-words">
              <Mail className="w-4 h-4 text-[#5246D8] dark:text-[#9286D8] shrink-0" aria-hidden="true" />
              <span>{SITE_IDENTITY.email}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={`mailto:${SITE_IDENTITY.email}`}
                className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-xs font-semibold"
              >
                <span>Open Email App</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-black/12 dark:border-white/12 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#167A5B] dark:text-[#7EC9B5]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-5 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#4D5363] dark:text-[#A9B1C2]">
              X Account
            </span>
            <a
              href={SITE_IDENTITY.social.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${SITE_IDENTITY.social.xHandle} on X`}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm font-mono font-medium text-[#080B12] dark:text-[#F3F0E9] hover:text-[#5246D8] dark:hover:text-[#9286D8] transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-3.5 h-3.5 shrink-0"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{SITE_IDENTITY.social.xHandle}</span>
            </a>
          </div>

          <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
            This portfolio does not run a background mail server or store form submissions. Compose your note here, then send it from your own email application.
          </p>
        </aside>

        {/* Accessible Email Draft Composer */}
        <div className="lg:col-span-7 rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-7 sm:p-8 space-y-5">
          <div className="border-b border-black/10 dark:border-white/10 pb-4 space-y-1">
            <h2 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Compose an Email Draft
            </h2>
            <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              Preparing a draft does not send the message automatically — you review and send it from your own email app or webmail.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-[#080B12] dark:text-[#F3F0E9] mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  placeholder="Ama Mensah"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#F3F0E9] dark:bg-[#080B12] text-sm text-[#080B12] dark:text-[#F3F0E9]"
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    role="alert"
                    className="mt-1.5 text-xs text-[#B42318] dark:text-[#FDA29B]"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-[#080B12] dark:text-[#F3F0E9] mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  placeholder="you@example.com"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#F3F0E9] dark:bg-[#080B12] text-sm text-[#080B12] dark:text-[#F3F0E9]"
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-1.5 text-xs text-[#B42318] dark:text-[#FDA29B]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-topic"
                className="block text-sm font-medium text-[#080B12] dark:text-[#F3F0E9] mb-1.5"
              >
                Topic
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                aria-invalid={Boolean(errors.topic)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#F3F0E9] dark:bg-[#080B12] text-sm text-[#080B12] dark:text-[#F3F0E9]"
              >
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-[#080B12] dark:text-[#F3F0E9] mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                placeholder="Tell me a little about what you are working on or asking about..."
                className="w-full px-4 py-3 rounded-xl border border-black/15 dark:border-white/15 bg-[#F3F0E9] dark:bg-[#080B12] text-sm text-[#080B12] dark:text-[#F3F0E9]"
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  role="alert"
                  className="mt-1.5 text-xs text-[#B42318] dark:text-[#FDA29B]"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Prepare Email Draft</span>
              </button>
            </div>

            {submittedHref && (
              <div
                role="status"
                aria-live="polite"
                className="mt-4 rounded-xl border border-[#167A5B]/30 dark:border-[#7EC9B5]/30 bg-[#167A5B]/10 dark:bg-[#7EC9B5]/10 p-4 sm:p-5 space-y-3"
              >
                <p className="text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  Email draft prepared — not sent yet
                </p>
                <p className="text-xs text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
                  Your message has not been sent automatically. Click below to open it in your email app addressed to {SITE_IDENTITY.email}, or copy the full draft to paste into webmail.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                  <a
                    href={submittedHref}
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#167A5B] dark:bg-[#7EC9B5] text-[#FAF8F4] dark:text-[#080B12] text-xs font-semibold"
                  >
                    <span>Open in Email App</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyFullDraft}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-black/15 dark:border-white/20 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9]"
                  >
                    {copiedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#167A5B] dark:text-[#7EC9B5]" aria-hidden="true" />
                        <span>Draft Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy Full Draft</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
