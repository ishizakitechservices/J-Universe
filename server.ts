import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_CONTACT_RECIPIENT,
  buildMailtoHref,
  formatContactDraft,
  formatContactSubject,
  isAllowedWebhookUrl,
  isValidEmailAddress,
  sanitizeHeaderText,
  validateContactForm,
  type ContactApiResponse,
  type ContactFormInput,
} from './src/utils/contactSubmission.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 6;
const MAX_TRACKED_IPS = 500;

const ipSubmissionWindow = new Map<string, number[]>();

function isRateLimited(ipKey: string, nowMs: number): boolean {
  if (ipSubmissionWindow.size > MAX_TRACKED_IPS) {
    for (const [key, timestamps] of ipSubmissionWindow.entries()) {
      const active = timestamps.filter((t) => nowMs - t < RATE_WINDOW_MS);
      if (active.length === 0) {
        ipSubmissionWindow.delete(key);
      } else {
        ipSubmissionWindow.set(key, active);
      }
    }
  }

  const recent = (ipSubmissionWindow.get(ipKey) ?? []).filter(
    (t) => nowMs - t < RATE_WINDOW_MS
  );
  if (recent.length >= RATE_MAX_REQUESTS) {
    ipSubmissionWindow.set(ipKey, recent);
    return true;
  }
  recent.push(nowMs);
  ipSubmissionWindow.set(ipKey, recent);
  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

async function dispatchToConfiguredInboxRelay(
  input: ContactFormInput,
  recipient: string
): Promise<{
  configured: boolean;
  delivered: boolean;
  provider?: 'resend' | 'web3forms' | 'webhook';
  errorMessage?: string;
}> {
  const cleanName = sanitizeHeaderText(input.name);
  const cleanReply = sanitizeHeaderText(input.email ?? '');
  const hasValidEmail = isValidEmailAddress(cleanReply);
  const subject = formatContactSubject(input);
  const plainBody = [
    `New message from J/UNIVERSE`,
    '',
    `From: ${cleanName}`,
    `Reply Contact: ${cleanReply || 'Not provided'}`,
    `Topic: ${sanitizeHeaderText(input.topic)}`,
    '',
    'Message:',
    input.message.trim(),
  ].join('\n');

  const resendKey = process.env.RESEND_API_KEY?.trim().replace(/^["']|["']$/g, '');
  if (resendKey) {
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL?.trim() || 'J/UNIVERSE <onboarding@resend.dev>';
    const payload: Record<string, unknown> = {
      from: fromEmail,
      to: [recipient],
      subject,
      text: plainBody,
    };
    if (hasValidEmail) {
      payload.reply_to = cleanReply;
    }

    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const parsed = (await upstream.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;

    if (!upstream.ok || !parsed?.id) {
      return {
        configured: true,
        delivered: false,
        provider: 'resend',
        errorMessage:
          parsed?.message ||
          'Resend could not send this message. Check your RESEND_API_KEY and sender configuration.',
      };
    }

    return { configured: true, delivered: true, provider: 'resend' };
  }

  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (web3FormsKey) {
    const payload: Record<string, unknown> = {
      access_key: web3FormsKey,
      subject,
      from_name: cleanName,
      name: cleanName,
      topic: sanitizeHeaderText(input.topic),
      message: plainBody,
    };
    if (hasValidEmail) {
      payload.email = cleanReply;
      payload.replyto = cleanReply;
    }

    const upstream = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const parsed = (await upstream.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!upstream.ok || parsed?.success === false) {
      const upstreamMsg = parsed?.message ?? '';
      const requiresClientOrPro =
        upstream.status === 403 &&
        (!parsed || /client\s*side|pro plan/i.test(upstreamMsg));

      return {
        configured: !requiresClientOrPro,
        delivered: false,
        provider: 'web3forms',
        errorMessage: requiresClientOrPro
          ? 'Automatic server-side delivery via Web3Forms is unavailable on this host (use VITE_WEB3FORMS_ACCESS_KEY for browser submission or RESEND_API_KEY for direct server delivery). Your message is ready to send via your email app or copy below.'
          : 'The inbox delivery service could not accept this message.',
      };
    }

    return { configured: true, delivered: true, provider: 'web3forms' };
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhookUrl && isAllowedWebhookUrl(webhookUrl)) {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        recipient,
        subject,
        name: cleanName,
        replyContact: cleanReply || null,
        topic: sanitizeHeaderText(input.topic),
        message: input.message.trim(),
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!upstream.ok) {
      return {
        configured: true,
        delivered: false,
        provider: 'webhook',
        errorMessage: 'The configured webhook endpoint returned an error.',
      };
    }

    return { configured: true, delivered: true, provider: 'webhook' };
  }

  return { configured: false, delivered: false };
}

async function createApp() {
  const app = express();
  app.set('trust proxy', true);

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use('/api', express.json({ limit: '16kb' }));
  app.use('/api', (err: unknown, _req: Request, res: Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError || (typeof err === 'object' && err !== null && 'type' in err && (err as { type?: string }).type === 'entity.too.large')) {
      res.status(400).json({
        ok: false,
        delivered: false,
        mode: 'validation_error',
        recipient: process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_RECIPIENT,
        message: 'Invalid or oversized request payload.',
      });
      return;
    }
    next(err);
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const recipient =
      process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_RECIPIENT;

    const body = req.body as Partial<ContactFormInput> | undefined;
    if (!body || typeof body !== 'object') {
      const responseBody: ContactApiResponse = {
        ok: false,
        delivered: false,
        mode: 'validation_error',
        recipient,
        message: 'Please provide your name, topic, and message.',
      };
      res.status(400).json(responseBody);
      return;
    }

    const input: ContactFormInput = {
      name: typeof body.name === 'string' ? body.name : '',
      email: typeof body.email === 'string' ? body.email : '',
      topic: typeof body.topic === 'string' ? body.topic : '',
      message: typeof body.message === 'string' ? body.message : '',
      website: typeof body.website === 'string' ? body.website : '',
    };

    // Silently ignore automated bot submissions filling the hidden honeypot field
    if (input.website && input.website.trim().length > 0) {
      const botResponse: ContactApiResponse = {
        ok: true,
        delivered: false,
        mode: 'email_draft_fallback',
        recipient,
      };
      res.status(200).json(botResponse);
      return;
    }

    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp, Date.now())) {
      const limitedResponse: ContactApiResponse = {
        ok: false,
        delivered: false,
        mode: 'rate_limited',
        recipient,
        message: 'Too many messages sent recently. Please wait a few minutes or email directly.',
        mailtoHref: buildMailtoHref(input, recipient),
        draftText: formatContactDraft(input, recipient),
      };
      res.status(429).json(limitedResponse);
      return;
    }

    const validation = validateContactForm(input);
    if (!validation.valid) {
      const invalidResponse: ContactApiResponse = {
        ok: false,
        delivered: false,
        mode: 'validation_error',
        recipient,
        message: 'Please check the highlighted fields.',
        errors: validation.errors,
      };
      res.status(400).json(invalidResponse);
      return;
    }

    const mailtoHref = buildMailtoHref(input, recipient);
    const draftText = formatContactDraft(input, recipient);

    try {
      const relayResult = await dispatchToConfiguredInboxRelay(input, recipient);

      if (relayResult.configured && relayResult.delivered) {
        const successResponse: ContactApiResponse = {
          ok: true,
          delivered: true,
          mode: 'inbox_relay',
          provider: relayResult.provider,
          recipient,
          message: `Your message has been delivered to ${recipient}.`,
        };
        res.status(200).json(successResponse);
        return;
      }

      if (relayResult.configured && !relayResult.delivered) {
        const errorResponse: ContactApiResponse = {
          ok: false,
          delivered: false,
          mode: 'relay_error',
          provider: relayResult.provider,
          recipient,
          message:
            relayResult.errorMessage ||
            'Direct inbox delivery is temporarily unavailable. Use your email app or copy the draft below.',
          mailtoHref,
          draftText,
        };
        res.status(502).json(errorResponse);
        return;
      }

      const fallbackResponse: ContactApiResponse = {
        ok: true,
        delivered: false,
        mode: 'email_draft_fallback',
        provider: relayResult.provider,
        recipient,
        message:
          relayResult.errorMessage ||
          'Direct inbox relay is not configured on this server yet, so nothing was sent automatically. Send using your email app or copy the draft below.',
        mailtoHref,
        draftText,
      };
      res.status(200).json(fallbackResponse);
    } catch {
      const errorResponse: ContactApiResponse = {
        ok: false,
        delivered: false,
        mode: 'relay_error',
        recipient,
        message:
          'Could not reach the mail delivery service. Send using your email app or copy your message below.',
        mailtoHref,
        draftText,
      };
      res.status(502).json(errorResponse);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const indexHtml = path.join(distDir, 'index.html');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Production bundle not found. Run npm run build first.');
      }
    });
  }

  return app;
}

createApp()
  .then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`J/UNIVERSE server listening on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
