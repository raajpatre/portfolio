"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Loader2 } from "lucide-react";

// ─── Pixel raven SVG ───────────────────────────────────────────────────
function Raven({ className = "w-9 h-9 [image-rendering:pixelated] flex-shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="6" y="4" width="4" height="1" fill="#e8e8f0" />
      <rect x="5" y="5" width="6" height="1" fill="#e8e8f0" />
      <rect x="4" y="6" width="8" height="2" fill="#e8e8f0" />
      <rect x="4" y="8" width="7" height="2" fill="#e8e8f0" />
      <rect x="5" y="10" width="6" height="1" fill="#e8e8f0" />
      <rect x="9" y="2" width="2" height="2" fill="#e8e8f0" />
      <rect x="9" y="5" width="1" height="1" fill="#f5c542" />
      <rect x="11" y="5" width="2" height="1" fill="#f5c542" />
      <rect x="12" y="6" width="1" height="1" fill="#f5c542" />
      <rect x="5" y="7" width="5" height="1" fill="#6b7094" />
      <rect x="6" y="8" width="4" height="1" fill="#6b7094" />
      <rect x="6" y="11" width="1" height="1" fill="#f5c542" />
      <rect x="9" y="11" width="1" height="1" fill="#f5c542" />
      <rect x="1" y="9" width="3" height="1" fill="#f5c542" />
      <rect x="1" y="10" width="3" height="1" fill="#d9ad34" />
    </svg>
  );
}

// X / Twitter inline SVG
function XLogo({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.012L4.6 22H1.34l8.02-9.165L1 2h7.02l4.85 6.41L18.244 2zm-1.2 18h1.9L7.06 4H5.06l11.984 16z" />
    </svg>
  );
}

// ─── Channels ──────────────────────────────────────────────────────────
type Cls = "gold" | "violet" | "teal" | "red";

const CLS_COLOR: Record<Cls, string> = {
  gold: "#f5c542",
  violet: "#7c6df5",
  teal: "#3dd6ac",
  red: "#f55c5c",
};

const CHANNELS: Array<{
  key: string;
  label: string;
  value: string;
  href: string | null;
  cls: Cls;
  copyable?: boolean;
  Icon: React.FC<{ className?: string }>;
}> = [
  {
    key: "email",
    label: "EMAIL",
    value: "raajpatre.dev@gmail.com",
    href: "mailto:raajpatre.dev@gmail.com",
    cls: "gold",
    copyable: true,
    Icon: ({ className }) => <Mail className={className} strokeWidth={1.8} />,
  },
  {
    key: "github",
    label: "GITHUB",
    value: "github.com/raajpatre",
    href: "https://github.com/raajpatre",
    cls: "violet",
    Icon: ({ className }) => <Github className={className} strokeWidth={1.8} />,
  },
  {
    key: "linkedin",
    label: "LINKEDIN",
    value: "linkedin.com/in/raajpatre",
    href: "https://linkedin.com/in/raajpatre",
    cls: "teal",
    Icon: ({ className }) => <Linkedin className={className} strokeWidth={1.8} />,
  },
  {
    key: "twitter",
    label: "X / TWITTER",
    value: "@raajpatre",
    href: "https://x.com/raajpatre",
    cls: "red",
    Icon: ({ className }) => <XLogo className={className} />,
  },
  {
    key: "location",
    label: "LOCATION",
    value: "Bengaluru, IN",
    href: null,
    cls: "violet",
    Icon: ({ className }) => <MapPin className={className} strokeWidth={1.8} />,
  },
];

function ChannelsCard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const onCopy = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      /* ignore — older browsers */
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1400);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-bg-surface border-2 border-accent-violet rounded-sm h-fit"
      style={{ boxShadow: "0 0 18px rgba(124,109,245,0.25), 0 0 0 1px #7c6df5" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-pixel">
        <span className="font-pixel text-[9px] text-accent-violet tracking-[0.12em]">
          ▸ DIRECT CHANNELS
        </span>
        <span className="inline-flex items-center gap-1.5 font-pixel text-[7px] text-accent-teal tracking-[0.1em]">
          <span className="w-1.5 h-1.5 bg-accent-teal shadow-[0_0_8px_#3dd6ac] inline-block animate-pulse" />
          ONLINE
        </span>
      </div>

      {/* Channel rows */}
      {CHANNELS.map((c, i) => {
        const color = CLS_COLOR[c.cls];
        const isLast = i === CHANNELS.length - 1;
        const Tag = (c.href ? "a" : "div") as React.ElementType;
        const linkProps: Record<string, string | undefined> = c.href
          ? {
              href: c.href,
              ...(c.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {}),
            }
          : {};
        const isHover = hoverKey === c.key;

        return (
          <Tag
            key={c.key}
            {...linkProps}
            className={`relative flex items-center gap-3.5 px-4 py-3.5 text-text-primary no-underline transition-colors duration-150 hover:bg-bg-elevated ${
              isLast ? "" : "border-b border-border-pixel"
            }`}
            onMouseEnter={() => setHoverKey(c.key)}
            onMouseLeave={() => setHoverKey(null)}
          >
            {/* Icon */}
            <span
              className="w-8 h-8 flex items-center justify-center bg-bg-elevated border rounded-sm transition-all duration-150 flex-shrink-0"
              style={{
                color: isHover ? color : "#6b7094",
                borderColor: isHover ? color : "#2a2d4a",
                boxShadow: isHover
                  ? `0 0 8px ${color}, 0 0 0 1px ${color}`
                  : "0 0 0 1px #2a2d4a",
              }}
            >
              <c.Icon className="w-[18px] h-[18px]" />
            </span>

            {/* Label + value */}
            <div className="flex-1 min-w-0">
              <div className="font-pixel text-[7px] text-text-muted tracking-[0.12em] mb-1">
                {c.label}
              </div>
              <div className="font-mono text-[13px] text-text-primary break-words">
                {c.value}
              </div>
            </div>

            {/* Copy button (email only) */}
            {c.copyable && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCopy(c.key, c.value);
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[7px] px-2 py-1.5 border rounded-sm tracking-[0.08em] transition-all duration-150 cursor-pointer ${
                  copiedKey === c.key
                    ? "text-accent-teal border-accent-teal shadow-[0_0_0_1px_#3dd6ac] opacity-100"
                    : isHover
                    ? "text-text-muted border-border-pixel shadow-[0_0_0_1px_#2a2d4a] opacity-100 hover:text-accent-teal hover:border-accent-teal hover:shadow-[0_0_0_1px_#3dd6ac]"
                    : "text-text-muted border-border-pixel shadow-[0_0_0_1px_#2a2d4a] opacity-0"
                }`}
              >
                {copiedKey === c.key ? "COPIED" : "COPY"}
              </button>
            )}
          </Tag>
        );
      })}

      {/* Footer meta grid */}
      <div className="px-4 py-3.5 border-t border-border-pixel bg-bg-base/40 grid grid-cols-2 gap-2.5">
        {[
          { k: "STATUS", v: "▸ Open to quests", vCls: "text-accent-teal" },
          { k: "RESPONSE", v: "~24 hours", vCls: "text-text-primary" },
          { k: "TIMEZONE", v: "UTC+5:30 (IST)", vCls: "text-text-primary" },
          { k: "PREFERRED", v: "Email", vCls: "text-accent-gold" },
        ].map((m) => (
          <div key={m.k} className="flex flex-col gap-1">
            <span className="font-pixel text-[7px] text-text-muted tracking-[0.1em]">{m.k}</span>
            <span className={`font-mono text-[12px] ${m.vCls}`}>{m.v}</span>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}

// ─── Topics ────────────────────────────────────────────────────────────
const TOPICS = [
  { id: "quest", label: "QUEST OPPORTUNITY", glyph: "★" },
  { id: "collab", label: "COLLAB", glyph: "◆" },
  { id: "hi", label: "JUST SAYING HI", glyph: "♪" },
  { id: "other", label: "OTHER", glyph: "▸" },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

const MAX_MSG = 800;

interface Receipt {
  name: string;
  email: string;
  topic: TopicId;
  msg: string;
  id: string;
  at: Date;
}

// ─── Field input ───────────────────────────────────────────────────────
function Field({
  id,
  label,
  type = "text",
  required,
  error,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-pixel text-[8px] text-text-muted tracking-[0.12em] mb-2"
      >
        {label}
        {required && <span className="text-accent-red ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full bg-bg-base text-text-primary border-2 px-3 py-2.5 font-mono text-[13px] rounded-sm outline-none transition-all duration-150 placeholder:text-text-muted ${
          error
            ? "border-accent-red shadow-[0_0_0_1px_#f55c5c]"
            : "border-border-pixel shadow-[0_0_0_1px_#2a2d4a] focus:border-accent-violet focus:shadow-[0_0_12px_rgba(124,109,245,0.4),0_0_0_1px_#7c6df5]"
        }`}
      />
      {error && <div className="text-[11px] text-accent-red font-mono mt-1.5">{error}</div>}
    </div>
  );
}

// ─── Form ──────────────────────────────────────────────────────────────
function ContactForm({ onSent }: { onSent: (r: Receipt) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<TopicId>("quest");
  const [msg, setMsg] = useState("");
  const [errs, setErrs] = useState<{ name?: string; email?: string; msg?: string }>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: typeof errs = {};
    if (!name.trim()) e.name = "Name required.";
    if (!email.trim()) e.email = "Email required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "That doesn't look like an email.";
    if (!msg.trim()) e.msg = "Add a message — even one line.";
    else if (msg.length > MAX_MSG) e.msg = `Keep it under ${MAX_MSG} characters.`;
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);

    // Build mailto link — opens the user's email client with prefilled fields.
    const topicLabel = TOPICS.find((t) => t.id === topic)?.label || "OTHER";
    const subject = `[${topicLabel}] From ${name}`;
    const body = `${msg}\n\n—\nFrom: ${name} <${email}>\nTopic: ${topicLabel}`;
    const url = `mailto:raajpatre.dev@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Small delay so the "DISPATCHING…" state is visible.
    setTimeout(() => {
      window.location.href = url;
      setSending(false);
      onSent({
        name,
        email,
        topic,
        msg,
        id: "RVN-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        at: new Date(),
      });
    }, 700);
  };

  const counterWarn = msg.length > MAX_MSG * 0.9;

  return (
    <motion.form
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onSubmit={onSubmit}
      noValidate
      className="bg-bg-surface border-2 border-accent-gold rounded-sm flex flex-col"
      style={{ boxShadow: "0 0 20px rgba(245,197,66,0.18), 0 0 0 1px #f5c542" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-pixel">
        <span className="font-pixel text-[10px] text-accent-gold tracking-[0.06em]">
          ✉ COMPOSE A RAVEN
        </span>
        <span className="font-pixel text-[9px] text-accent-teal tracking-[0.06em]">
          [ENC: AES-256]
        </span>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          <Field
            id="name"
            label="NAME"
            required
            error={errs.name}
            value={name}
            onChange={(v) => {
              setName(v);
              setErrs((x) => ({ ...x, name: undefined }));
            }}
            placeholder="Adventurer's name"
            autoComplete="name"
          />
          <Field
            id="email"
            label="EMAIL"
            type="email"
            required
            error={errs.email}
            value={email}
            onChange={(v) => {
              setEmail(v);
              setErrs((x) => ({ ...x, email: undefined }));
            }}
            placeholder="you@realm.com"
            autoComplete="email"
          />
        </div>

        {/* Topic chips */}
        <div className="mb-4">
          <label className="block font-pixel text-[8px] text-text-muted tracking-[0.12em] mb-2">
            TOPIC
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopic(t.id)}
                className={`font-mono text-[12px] border px-2.5 py-1.5 rounded-sm cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 ${
                  topic === t.id
                    ? "bg-accent-violet text-bg-base border-accent-violet shadow-[0_0_10px_rgba(124,109,245,0.55),0_0_0_1px_#7c6df5]"
                    : "bg-transparent text-text-muted border-border-pixel shadow-[0_0_0_1px_#2a2d4a] hover:text-accent-violet hover:border-accent-violet hover:shadow-[0_0_0_1px_#7c6df5]"
                }`}
              >
                <span className="text-[11px]">{t.glyph}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message textarea */}
        <div className="mb-4">
          <label
            htmlFor="msg"
            className="block font-pixel text-[8px] text-text-muted tracking-[0.12em] mb-2"
          >
            MESSAGE<span className="text-accent-red ml-1">*</span>
          </label>
          <textarea
            id="msg"
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
              setErrs((x) => ({ ...x, msg: undefined }));
            }}
            placeholder="Tell me what you're working on, what you'd like to build, or just say hi…"
            maxLength={MAX_MSG + 50}
            className={`w-full bg-bg-base text-text-primary border-2 px-3 py-2.5 font-mono text-[13px] rounded-sm outline-none transition-all duration-150 min-h-[140px] resize-y leading-[1.7] placeholder:text-text-muted ${
              errs.msg
                ? "border-accent-red shadow-[0_0_0_1px_#f55c5c]"
                : "border-border-pixel shadow-[0_0_0_1px_#2a2d4a] focus:border-accent-violet focus:shadow-[0_0_12px_rgba(124,109,245,0.4),0_0_0_1px_#7c6df5]"
            }`}
          />
          <div
            className={`font-pixel text-[7px] tracking-[0.08em] text-right mt-1.5 ${
              counterWarn ? "text-accent-red" : "text-text-muted"
            }`}
          >
            {msg.length} / {MAX_MSG}
          </div>
          {errs.msg && (
            <div className="text-[11px] text-accent-red font-mono mt-1.5">{errs.msg}</div>
          )}
        </div>
      </div>

      {/* Footer — note + SEND button */}
      <div className="px-5 sm:px-6 py-4 border-t border-border-pixel flex justify-between items-center gap-3.5 flex-wrap">
        <div className="font-mono text-[11px] text-text-muted leading-[1.5]">
          ↪ Replies within ~24h. For urgent quests, ping me on the gold channel.
        </div>
        <button
          type="submit"
          disabled={sending}
          className={`font-pixel text-[10px] tracking-[0.08em] border-2 px-4 py-3.5 rounded-sm cursor-pointer transition-all duration-150 inline-flex items-center gap-2.5 ${
            sending
              ? "bg-accent-violet border-accent-violet text-white shadow-[0_0_0_1px_#7c6df5] opacity-100"
              : "bg-accent-gold border-accent-gold text-bg-base shadow-[0_0_0_1px_#f5c542] hover:scale-[1.03] hover:shadow-[0_0_18px_#f5c542,0_0_0_1px_#f5c542] hover:brightness-110 active:scale-[0.98] disabled:opacity-55 disabled:cursor-not-allowed"
          }`}
        >
          {sending ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              DISPATCHING…
            </>
          ) : (
            "▶  SEND RAVEN"
          )}
        </button>
      </div>
    </motion.form>
  );
}

// ─── Success card ──────────────────────────────────────────────────────
function SuccessCard({ receipt, onReset }: { receipt: Receipt; onReset: () => void }) {
  const topicLabel = TOPICS.find((t) => t.id === receipt.topic)?.label || "—";
  const stamp = receipt.at
    .toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .toUpperCase();
  const firstName = receipt.name.split(" ")[0] || "adventurer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="bg-bg-surface border-2 border-accent-teal p-5 sm:p-6 rounded-sm h-fit"
      style={{ boxShadow: "0 0 22px rgba(61,214,172,0.3), 0 0 0 1px #3dd6ac" }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-border-pixel">
        <span className="font-pixel text-[10px] text-accent-teal tracking-[0.06em]">
          ▸ RAVEN-MASTER
        </span>
        <span className="font-pixel text-[9px] text-accent-gold">[QUEST RECEIVED]</span>
      </div>

      <p className="font-mono text-[14px] text-text-primary leading-[1.8] m-0">
        <strong className="text-accent-teal font-bold">Message dispatched.</strong> Your raven is in the air, {firstName}. Your email client should have opened — if not, copy the address from the channels card. I&apos;ll reply to{" "}
        <span className="text-accent-gold">{receipt.email}</span> within ~24 hours, usually faster.
      </p>

      {/* Receipt grid */}
      <div className="grid grid-cols-2 gap-3 my-3.5 p-3 bg-bg-base/50 border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] rounded-sm">
        {[
          { k: "QUEST ID", v: receipt.id, cls: "text-accent-gold" },
          { k: "TOPIC", v: topicLabel, cls: "text-text-primary" },
          { k: "SENT", v: stamp, cls: "text-accent-teal" },
          { k: "CHARACTERS", v: String(receipt.msg.length), cls: "text-text-primary" },
        ].map((m) => (
          <div key={m.k} className="flex flex-col gap-1">
            <span className="font-pixel text-[7px] text-text-muted tracking-[0.1em]">{m.k}</span>
            <span className={`font-mono text-[12px] ${m.cls}`}>{m.v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 flex-wrap">
        <a
          href="/"
          className="font-pixel text-[9px] text-bg-base bg-accent-gold border-2 border-accent-gold shadow-[0_0_0_1px_#f5c542] px-3.5 py-3 rounded-sm tracking-[0.08em] inline-flex items-center gap-2 cursor-pointer transition-all duration-150 hover:scale-[1.03] hover:shadow-[0_0_14px_#f5c542,0_0_0_1px_#f5c542]"
        >
          ↩  RETURN TO TOWN
        </a>
        <button
          type="button"
          onClick={onReset}
          className="font-pixel text-[9px] text-accent-violet bg-transparent border-2 border-accent-violet shadow-[0_0_0_1px_#7c6df5] px-3.5 py-3 rounded-sm tracking-[0.08em] cursor-pointer transition-colors duration-150 hover:bg-accent-violet hover:text-bg-base"
        >
          [ SEND ANOTHER ]
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page composition ─────────────────────────────────────────────────
export function ContactCard() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Memoize so layout doesn't re-render channels card unnecessarily
  const channels = useMemo(() => <ChannelsCard />, []);

  return (
    <>
      {/* Page header — eyebrow + raven title + subtitle */}
      <section className="relative z-[1] text-center border-b border-border-pixel px-5 py-14">
        <p className="font-pixel text-[8px] text-accent-violet tracking-[0.3em] mb-4">
          ▸ CHAPTER 06 / CONTACT
        </p>
        <h1
          className="font-pixel text-[clamp(22px,4.5vw,32px)] text-accent-gold tracking-[0.06em] mb-3.5 inline-flex items-center gap-4 sm:gap-5"
          style={{ textShadow: "0 0 22px rgba(245,197,66,0.35)" }}
        >
          <Raven />
          SEND A RAVEN
          <Raven />
        </h1>
        <p className="font-mono text-[14px] text-text-muted max-w-[540px] mx-auto leading-[1.7]">
          Drop a message. Quest offers, collabs, or just a hi — I read everything and reply within
          a day.
        </p>
      </section>

      {/* Two-column layout */}
      <main className="relative z-[1] grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] gap-6 max-w-[1100px] mx-auto w-full px-5 sm:px-8 py-9 pb-20">
        {channels}
        {receipt ? (
          <SuccessCard receipt={receipt} onReset={() => setReceipt(null)} />
        ) : (
          <ContactForm onSent={setReceipt} />
        )}
      </main>
    </>
  );
}
