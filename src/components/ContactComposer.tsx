import React, { useId, useState } from 'react';
import { Check, CheckCircle2, Copy, ExternalLink, Loader2, Send } from 'lucide-react';
import { SITE_IDENTITY } from '../data/universeData';
import {
  CONTACT_TOPICS,
  ContactApiResponse,
  ContactFormInput,
  buildMailtoHref,
  copyTextSafely,
  formatContactDraft,
  validateContactForm,
} from '../utils/contactSubmission';

interface TopicOption {
  shortLabel: string;
  value: string;
}

const TOPIC_OPTIONS: TopicOption[] = [
  { shortLabel: 'ClassApp', value: CONTACT_TOPICS[0] },
  { shortLabel: 'MilkyPy', value: CONTACT_TOPICS[1] },
  { shortLabel: 'Ishizaki Studio', value: CONTACT_TOPICS[2] },
  { shortLabel: 'General', value: CONTACT_TOPICS[3] },
];

interface ContactComposerProps {
  variant?: 'full' | 'embedded';
}

export function ContactComposer({ variant = 'full' }: ContactComposerProps) {
  const uid = useId();
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    topic: TOPIC_OPTIONS[0].value,
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'email' | 'topic' | 'message', string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ContactApiResponse | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const resetForNewMessage = () => {
    setForm({
      name: '',
      email: '',
      topic: TOPIC_OPTIONS[0].value,
      message: '',
      website: '',
    });
    setErrors({});
    setResult(null);
    setNetworkError(null);
  };

  const handleCopyDraft = async () => {
    const draft =
      result?.draftText ?? formatContactDraft(form, SITE_IDENTITY.email);
    const copied = await copyTextSafely(draft);
    if (copied) {
      setCopiedDraft(true);
      window.setTimeout(() => setCopiedDraft(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(null);

    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setResult(null);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const clientWeb3FormsKey = (
        import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined
      )?.trim();

      if (clientWeb3FormsKey && !(form.website && form.website.trim().length > 0)) {
        try {
          const formData = new FormData();
          formData.append('access_key', clientWeb3FormsKey);
          formData.append('subject', `[J/UNIVERSE] ${form.topic.trim()} — ${form.name.trim()}`);
          formData.append('from_name', form.name.trim());
          formData.append('name', form.name.trim());
          formData.append('topic', form.topic.trim());
          if (form.email.trim()) {
            formData.append('email', form.email.trim());
            formData.append('replyto', form.email.trim());
          }
          formData.append(
            'message',
            `${form.message.trim()}\n\nFrom: ${form.name.trim()}\nReply Contact: ${form.email.trim() || 'Not provided'}`
          );

          const clientRes = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData,
          });
          const clientData = (await clientRes.json().catch(() => null)) as
            | { success?: boolean; message?: string }
            | null;

          if (clientRes.ok && clientData?.success) {
            setResult({
              ok: true,
              delivered: true,
              mode: 'inbox_relay',
              provider: 'web3forms',
              recipient: SITE_IDENTITY.email,
              message: `Your message has been delivered to ${SITE_IDENTITY.email}.`,
            });
            return;
          }
        } catch {
          // Fall through cleanly to /api/contact server route
        }
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (response.status === 400 && data.errors) {
        setErrors(data.errors);
        setResult(null);
        return;
      }

      if (!response.ok) {
        setNetworkError(
          data.message ||
            'Could not reach the delivery service right now. You can still send directly via your email app or copy your message.'
        );
        setResult({
          ok: false,
          delivered: false,
          mode: data.mode || 'relay_error',
          recipient: data.recipient || SITE_IDENTITY.email,
          mailtoHref: data.mailtoHref || buildMailtoHref(form),
          draftText: data.draftText || formatContactDraft(form),
        });
        return;
      }

      setResult(data);
    } catch {
      setNetworkError(
        'Network error while sending. Your message is preserved below so you can retry or open your email app.'
      );
      setResult({
        ok: false,
        delivered: false,
        mode: 'relay_error',
        recipient: SITE_IDENTITY.email,
        mailtoHref: buildMailtoHref(form),
        draftText: formatContactDraft(form),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !submitting) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const isEmbedded = variant === 'embedded';

  const surfaceText = isEmbedded
    ? 'text-[#F3F0E9]'
    : 'text-[#080B12] dark:text-[#F3F0E9]';
  const mutedText = isEmbedded
    ? 'text-[#A9B1C2]'
    : 'text-[#4D5363] dark:text-[#A9B1C2]';
  const inputSurface = isEmbedded
    ? 'border-[#F3F0E9]/16 bg-[#060911] text-[#F3F0E9] placeholder:text-[#A9B1C2]/55 focus:border-[#D3AC70]/70'
    : 'border-black/15 dark:border-white/15 bg-[#F3F0E9] dark:bg-[#080B12] text-[#080B12] dark:text-[#F3F0E9] placeholder:text-[#4D5363]/60 dark:placeholder:text-[#A9B1C2]/55 focus:border-[#5246D8] dark:focus:border-[#9286D8]';
  const dividerBorder = isEmbedded
    ? 'border-[#F3F0E9]/12'
    : 'border-black/10 dark:border-white/10';
  const topicContainerClass = isEmbedded
    ? 'bg-[#060911] border border-[#F3F0E9]/12'
    : 'bg-[#F3F0E9] dark:bg-[#080B12] border border-black/10 dark:border-white/12';

  if (result?.delivered) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="space-y-5 py-2"
      >
        <div className="flex items-start gap-3.5">
          <CheckCircle2
            className="w-6 h-6 text-[#167A5B] dark:text-[#7EC9B5] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1.5">
            <h3 className={`font-display text-xl font-semibold ${surfaceText}`}>
              Message sent to Johnson&apos;s inbox
            </h3>
            <p className={`text-sm leading-relaxed ${mutedText}`}>
              Delivered directly to{' '}
              <span className={`font-mono ${surfaceText}`}>{result.recipient}</span>.
              {form.email.trim()
                ? ` Reply contact noted as ${form.email.trim()}.`
                : ' Sent without requiring your email address.'}
            </p>
          </div>
        </div>

        <div className={`border-t ${dividerBorder} pt-4 flex flex-wrap items-center gap-3`}>
          <button
            type="button"
            onClick={resetForNewMessage}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
              isEmbedded
                ? 'bg-[#F3F0E9] text-[#080B12] hover:bg-[#D3AC70]'
                : 'bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] hover:opacity-90'
            }`}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={`border-b ${dividerBorder} pb-4 space-y-1`}>
        <h2 className={`font-display ${isEmbedded ? 'text-xl sm:text-2xl' : 'text-xl'} font-semibold ${surfaceText}`}>
          Send a Direct Note
        </h2>
        <p className={`text-xs leading-relaxed ${mutedText}`}>
          Goes straight to {SITE_IDENTITY.email} — no email address required unless you want a reply.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Topic Segmented Controls */}
        <div className="space-y-1.5">
          <span className={`block text-sm font-medium ${surfaceText}`}>
            Topic
          </span>
          <div
            role="radiogroup"
            aria-label="Inquiry category"
            className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-xl ${topicContainerClass}`}
          >
            {TOPIC_OPTIONS.map((option) => {
              const selected = form.topic === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setForm((prev) => ({ ...prev, topic: option.value }))}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap text-center focus-visible:outline-2 focus-visible:outline-[#9286D8] ${
                    selected
                      ? isEmbedded
                        ? 'bg-[#D3AC70] text-[#080B12] font-semibold'
                        : 'bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] font-semibold'
                      : isEmbedded
                      ? 'text-[#A9B1C2] hover:text-[#F3F0E9]'
                      : 'text-[#4D5363] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
                  }`}
                >
                  {option.shortLabel}
                </button>
              );
            })}
          </div>
          {errors.topic && (
            <p role="alert" className="text-xs text-[#B42318] dark:text-[#FDA29B]">
              {errors.topic}
            </p>
          )}
        </div>

        {/* Name + Optional Reply Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`${uid}-name`}
              className={`block text-sm font-medium ${surfaceText} mb-1.5`}
            >
              Your Name
            </label>
            <input
              id={`${uid}-name`}
              name="name"
              type="text"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${uid}-name-error` : undefined}
              placeholder="Ama Mensah"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputSurface}`}
            />
            {errors.name && (
              <p
                id={`${uid}-name-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#B42318] dark:text-[#FDA29B]"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <label
                htmlFor={`${uid}-email`}
                className={`block text-sm font-medium ${surfaceText}`}
              >
                Reply Contact
              </label>
              <span className={`text-xs ${mutedText}`}>Optional</span>
            </div>
            <input
              id={`${uid}-email`}
              name="email"
              type="text"
              inputMode="email"
              maxLength={120}
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={`${uid}-email-hint`}
              placeholder="Email or @handle (optional)"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputSurface}`}
            />
            {errors.email ? (
              <p
                id={`${uid}-email-hint`}
                role="alert"
                className="mt-1.5 text-xs text-[#B42318] dark:text-[#FDA29B]"
              >
                {errors.email}
              </p>
            ) : (
              <p id={`${uid}-email-hint`} className={`mt-1 text-[11px] ${mutedText}`}>
                Leave blank to message without sharing an email.
              </p>
            )}
          </div>
        </div>

        {/* Honeypot anti-spam field */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input
            id={`${uid}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
          />
        </div>

        {/* Message */}
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <label
              htmlFor={`${uid}-message`}
              className={`block text-sm font-medium ${surfaceText}`}
            >
              Message
            </label>
            <span className={`text-[11px] font-mono tabular-nums ${mutedText}`}>
              {form.message.length} / 2500
            </span>
          </div>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={isEmbedded ? 4 : 5}
            maxLength={2500}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            onKeyDown={handleKeyDown}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${uid}-message-error` : undefined}
            placeholder="Share a question, feedback on ClassApp or MilkyPy, or what you are building..."
            className={`w-full px-3.5 py-3 rounded-xl border text-sm outline-none transition-colors resize-y ${inputSurface}`}
          />
          {errors.message && (
            <p
              id={`${uid}-message-error`}
              role="alert"
              className="mt-1.5 text-xs text-[#B42318] dark:text-[#FDA29B]"
            >
              {errors.message}
            </p>
          )}
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-60 ${
              isEmbedded
                ? 'bg-[#F3F0E9] text-[#080B12] hover:bg-[#D3AC70]'
                : 'bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] hover:opacity-90'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Send Message</span>
              </>
            )}
          </button>

          <span className={`text-[11px] ${mutedText}`}>
            No email address required
          </span>
        </div>

        {/* Honest fallback / error panel when server inbox relay is unconfigured or offline */}
        {result && !result.delivered && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-4 rounded-xl border p-4 space-y-3 ${
              networkError
                ? 'border-[#B42318]/40 bg-[#B42318]/10'
                : isEmbedded
                ? 'border-[#D3AC70]/35 bg-[#D3AC70]/10'
                : 'border-[#167A5B]/30 dark:border-[#7EC9B5]/30 bg-[#167A5B]/10 dark:bg-[#7EC9B5]/10'
            }`}
          >
            <p className={`text-sm font-semibold ${surfaceText}`}>
              {networkError
                ? 'Could not deliver automatically'
                : 'Message ready — send via your email app'}
            </p>
            <p className={`text-xs leading-relaxed ${mutedText}`}>
              {networkError ||
                result.message ||
                `Your note was not sent automatically yet. Open it in your email app addressed to ${result.recipient}, or copy the formatted draft below.`}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              {result.mailtoHref && (
                <a
                  href={result.mailtoHref}
                  className={`min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    isEmbedded
                      ? 'bg-[#D3AC70] text-[#080B12]'
                      : 'bg-[#167A5B] dark:bg-[#7EC9B5] text-[#FAF8F4] dark:text-[#080B12]'
                  }`}
                >
                  <span>Open in Email App</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
              <button
                type="button"
                onClick={handleCopyDraft}
                className={`min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-medium whitespace-nowrap ${
                  isEmbedded
                    ? 'border-[#F3F0E9]/20 text-[#F3F0E9]'
                    : 'border-black/15 dark:border-white/20 text-[#080B12] dark:text-[#F3F0E9]'
                }`}
              >
                {copiedDraft ? (
                  <>
                    <Check
                      className={`w-3.5 h-3.5 ${
                        isEmbedded
                          ? 'text-[#7EC9B5]'
                          : 'text-[#167A5B] dark:text-[#7EC9B5]'
                      }`}
                      aria-hidden="true"
                    />
                    <span>Message Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
