export const DEFAULT_CONTACT_RECIPIENT = 'ishizakitechservices@gmail.com';

export const CONTACT_TOPICS = [
  'ClassApp Feedback or Inquiry',
  'MilkyPy Learning Inquiry',
  'Ishizaki Tech Services Collaboration',
  'General Question',
] as const;

export interface ContactFormInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  website?: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<'name' | 'email' | 'topic' | 'message', string>>;
}

export interface ContactApiResponse {
  ok: boolean;
  delivered: boolean;
  mode: 'inbox_relay' | 'email_draft_fallback' | 'validation_error' | 'rate_limited' | 'relay_error';
  recipient: string;
  provider?: 'resend' | 'web3forms' | 'webhook';
  message?: string;
  mailtoHref?: string;
  draftText?: string;
  errors?: Partial<Record<'name' | 'email' | 'topic' | 'message', string>>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const X_HANDLE_PATTERN = /^@[a-zA-Z0-9_]{1,15}$/;

export function isValidEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidXHandle(value: string): boolean {
  return X_HANDLE_PATTERN.test(value.trim());
}

export function sanitizeHeaderText(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1f\x7f]+/g, ' ').trim();
}

export function validateContactForm(
  input: ContactFormInput
): ContactValidationResult {
  const errors: ContactValidationResult['errors'] = {};

  const cleanName = input.name.trim();
  if (!cleanName || cleanName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  } else if (cleanName.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  const cleanEmail = (input.email ?? '').trim();
  if (cleanEmail.length > 120) {
    errors.email = 'Reply contact must be 120 characters or fewer.';
  } else if (cleanEmail.length > 0 && !isValidEmailAddress(cleanEmail) && !isValidXHandle(cleanEmail)) {
    errors.email = 'Enter a valid email address, an @handle, or leave this blank.';
  }

  const cleanTopic = input.topic.trim();
  if (!cleanTopic) {
    errors.topic = 'Please choose what you would like to discuss.';
  } else if (cleanTopic.length > 120) {
    errors.topic = 'Topic must be 120 characters or fewer.';
  }

  const cleanMessage = input.message.trim();
  if (!cleanMessage || cleanMessage.length < 10) {
    errors.message =
      'Please share a short note (at least 10 characters) so I know how to respond.';
  } else if (cleanMessage.length > 2500) {
    errors.message = 'Please keep your message within 2,500 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatContactSubject(input: ContactFormInput): string {
  const topic = sanitizeHeaderText(input.topic) || 'Portfolio Inquiry';
  const name = sanitizeHeaderText(input.name) || 'Visitor';
  return `[J/UNIVERSE] ${topic} — ${name}`;
}

export function formatContactDraft(
  input: ContactFormInput,
  recipient: string = DEFAULT_CONTACT_RECIPIENT
): string {
  const cleanName = sanitizeHeaderText(input.name);
  const cleanContact = sanitizeHeaderText(input.email ?? '');
  const cleanMessage = input.message.trim();
  const replyLine = cleanContact
    ? `Reply contact: ${cleanContact}`
    : 'Reply contact: Not provided (sent without visitor email)';

  return [
    `To: ${recipient}`,
    `Subject: ${formatContactSubject(input)}`,
    '',
    cleanMessage,
    '',
    `From: ${cleanName}`,
    replyLine,
  ].join('\n');
}

export function buildMailtoHref(
  input: ContactFormInput,
  recipient: string = DEFAULT_CONTACT_RECIPIENT
): string {
  const cleanName = sanitizeHeaderText(input.name);
  const cleanContact = sanitizeHeaderText(input.email ?? '');
  const subject = encodeURIComponent(formatContactSubject(input));
  const senderLine = cleanContact ? `${cleanName} (${cleanContact})` : cleanName;
  const body = encodeURIComponent(
    `Hi Johnson,\n\n${input.message.trim()}\n\nFrom: ${senderLine}`
  );
  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

export function isAllowedWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      !host ||
      host === 'localhost' ||
      host === '::1' ||
      host === '[::1]' ||
      host.endsWith('.local') ||
      host.endsWith('.internal')
    ) {
      return false;
    }
    // Block IPv4 loopback, link-local, metadata, and RFC1918 private ranges
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      const octets = host.split('.').map(Number);
      if (octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
        return false;
      }
      const [a, b] = octets;
      if (
        a === 0 ||
        a === 10 ||
        a === 127 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168)
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
