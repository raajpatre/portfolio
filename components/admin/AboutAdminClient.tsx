"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Save as SaveIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AboutContent, FactionEntry } from "@/data/about-types";

type Props = { initial: AboutContent };

// ─── Reusable section shell ─────────────────────────────────────────────
function Section({
  title,
  subtitle,
  children,
  defaultOpen = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border-pixel rounded-sm bg-bg-surface mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-bg-elevated/40 hover:bg-bg-elevated transition-colors"
      >
        <div className="text-left">
          <h2 className="font-mono text-[14px] font-bold text-text-primary tracking-[0.04em]">
            {title}
          </h2>
          {subtitle && (
            <p className="font-mono text-[11px] text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {open && <div className="p-5 space-y-3">{children}</div>}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] text-text-muted uppercase tracking-[0.08em]">
        {label}
      </label>
      {children}
      {hint && <p className="font-mono text-[10px] text-text-muted/70">{hint}</p>}
    </div>
  );
}

// ─── Main client ────────────────────────────────────────────────────────
export default function AboutAdminClient({ initial }: Props) {
  // Origin
  const [origin, setOrigin] = useState(initial.origin);
  // Guild
  const [guild, setGuild] = useState(initial.guild);
  // Factions
  const [factions, setFactions] = useState<FactionEntry[]>(initial.factions);
  // Stats — store skills as comma string for easy editing
  const [stats, setStats] = useState<{ label: string; skills: string }[]>(
    initial.stats.map((s) => ({ label: s.label, skills: s.skills.join(", ") }))
  );
  // Save file
  const [saveFile, setSaveFile] = useState(initial.saveFile);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // ── Factions handlers
  const addFaction = () =>
    setFactions((arr) => [
      ...arr,
      { org: "", role: "", duration: "", blurb: "", cls: "violet" },
    ]);
  const updateFaction = (i: number, patch: Partial<FactionEntry>) =>
    setFactions((arr) => arr.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const removeFaction = (i: number) =>
    setFactions((arr) => arr.filter((_, idx) => idx !== i));

  // ── Stats handlers
  const addStat = () => setStats((arr) => [...arr, { label: "", skills: "" }]);
  const updateStat = (i: number, patch: Partial<{ label: string; skills: string }>) =>
    setStats((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeStat = (i: number) => setStats((arr) => arr.filter((_, idx) => idx !== i));

  // ── Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedAt(null);
    setLoading(true);

    const payload = {
      origin: {
        ...origin,
        level: Number(origin.level) || 0,
      },
      guild: {
        ...guild,
        logo: guild.logo || null,
      },
      factions,
      stats: stats
        .map((s) => ({
          label: s.label.trim(),
          skills: s.skills
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        }))
        .filter((s) => s.label.length > 0),
      save_file: {
        ...saveFile,
        progressPct: Number(saveFile.progressPct) || 0,
      },
    };

    try {
      const res = await fetch("/api/admin/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const detailMsg =
          data?.details?.[0]?.path?.join?.(".") &&
          `${data.details[0].path.join(".")}: ${data.details[0].message}`;
        throw new Error(detailMsg || data?.error || "Failed to save");
      }
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "flex h-10 w-full rounded-sm border border-border-pixel bg-bg-base px-3 py-2 text-sm font-mono text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet";

  return (
    <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-mono text-[22px] font-bold text-text-primary tracking-[0.02em] mb-1">
            About Page
          </h1>
          <p className="font-mono text-[12px] text-text-muted">
            Edit each chapter. Changes appear on the public /about page after save (revalidates every 60s).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="font-mono text-[11px] text-accent-teal">Saved {savedAt}</span>
          )}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-accent-violet text-white hover:brightness-110"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SaveIcon className="mr-2 h-4 w-4" />
            )}
            Save all changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-accent-red/10 text-accent-red border border-accent-red/30 rounded-sm font-mono text-[12px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* CHAPTER 01 — ORIGIN */}
        <Section title="Chapter 01 · Origin" subtitle="Intro / hero block">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Name">
              <Input
                className={inputCls}
                value={origin.name}
                onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                placeholder="Raaj Patre"
              />
            </Field>
            <Field label="Class">
              <Input
                className={inputCls}
                value={origin.class}
                onChange={(e) => setOrigin({ ...origin, class: e.target.value })}
                placeholder="FULL-STACK DEVELOPER"
              />
            </Field>
            <Field label="Level">
              <Input
                type="number"
                min={0}
                max={99}
                className={inputCls}
                value={origin.level}
                onChange={(e) => setOrigin({ ...origin, level: Number(e.target.value) })}
              />
            </Field>
            <Field label="Location">
              <Input
                className={inputCls}
                value={origin.location}
                onChange={(e) => setOrigin({ ...origin, location: e.target.value })}
                placeholder="BENGALURU, IN"
              />
            </Field>
          </div>
          <Field label="Bio">
            <textarea
              className="flex min-h-[100px] w-full rounded-sm border border-border-pixel bg-bg-base px-3 py-2 text-sm font-mono text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
              value={origin.bio}
              onChange={(e) => setOrigin({ ...origin, bio: e.target.value })}
              placeholder="One short paragraph about you…"
            />
          </Field>
        </Section>

        {/* CHAPTER 02 — GUILD */}
        <Section title="Chapter 02 · Guild" subtitle="Education / institution card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Institution">
              <Input
                className={inputCls}
                value={guild.institution}
                onChange={(e) => setGuild({ ...guild, institution: e.target.value })}
              />
            </Field>
            <Field label="Role / Program">
              <Input
                className={inputCls}
                value={guild.role}
                onChange={(e) => setGuild({ ...guild, role: e.target.value })}
                placeholder="Computer Science · Batch 2"
              />
            </Field>
            <Field label="Duration">
              <Input
                className={inputCls}
                value={guild.duration}
                onChange={(e) => setGuild({ ...guild, duration: e.target.value })}
                placeholder="2024 → PRESENT"
              />
            </Field>
            <Field label="Location">
              <Input
                className={inputCls}
                value={guild.location}
                onChange={(e) => setGuild({ ...guild, location: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Flavor quote" hint="Short pull-quote shown under the card.">
            <Input
              className={inputCls}
              value={guild.flavor}
              onChange={(e) => setGuild({ ...guild, flavor: e.target.value })}
            />
          </Field>
        </Section>

        {/* CHAPTER 03 — FACTIONS */}
        <Section title="Chapter 03 · Factions" subtitle="Organizations / clubs / programs">
          {factions.map((f, i) => (
            <div
              key={i}
              className="border border-border-pixel rounded-sm p-4 bg-bg-base/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-muted">
                  Faction #{i + 1}
                </span>
                <Button
                  type="button"
                  onClick={() => removeFaction(i)}
                  className="h-8 px-2 text-accent-red bg-transparent hover:bg-accent-red/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Org">
                  <Input
                    className={inputCls}
                    value={f.org}
                    onChange={(e) => updateFaction(i, { org: e.target.value })}
                  />
                </Field>
                <Field label="Role">
                  <Input
                    className={inputCls}
                    value={f.role}
                    onChange={(e) => updateFaction(i, { role: e.target.value })}
                  />
                </Field>
                <Field label="Duration">
                  <Input
                    className={inputCls}
                    value={f.duration}
                    onChange={(e) => updateFaction(i, { duration: e.target.value })}
                  />
                </Field>
                <Field label="Color theme">
                  <select
                    className={inputCls}
                    value={f.cls}
                    onChange={(e) =>
                      updateFaction(i, { cls: e.target.value as FactionEntry["cls"] })
                    }
                  >
                    <option value="gold">Gold</option>
                    <option value="teal">Teal</option>
                    <option value="violet">Violet</option>
                  </select>
                </Field>
              </div>
              <Field label="Blurb">
                <textarea
                  className="flex min-h-[70px] w-full rounded-sm border border-border-pixel bg-bg-base px-3 py-2 text-sm font-mono text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
                  value={f.blurb}
                  onChange={(e) => updateFaction(i, { blurb: e.target.value })}
                />
              </Field>
            </div>
          ))}
          <Button
            type="button"
            onClick={addFaction}
            className="bg-transparent border border-accent-violet text-accent-violet hover:bg-accent-violet/10"
          >
            <Plus className="w-4 h-4 mr-2" /> Add faction
          </Button>
        </Section>

        {/* CHAPTER 04 — STATS */}
        <Section
          title="Chapter 04 · Stats"
          subtitle="Skill categories. Use ALL CAPS labels (FRONTEND / BACKEND / LANGUAGES / TOOLS) to get matching pixel icons; other labels still render text-only."
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="border border-border-pixel rounded-sm p-4 bg-bg-base/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-muted">
                  Category #{i + 1}
                </span>
                <Button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="h-8 px-2 text-accent-red bg-transparent hover:bg-accent-red/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Label">
                  <Input
                    className={inputCls}
                    value={s.label}
                    onChange={(e) => updateStat(i, { label: e.target.value.toUpperCase() })}
                    placeholder="FRONTEND"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Skills (comma separated)">
                    <Input
                      className={inputCls}
                      value={s.skills}
                      onChange={(e) => updateStat(i, { skills: e.target.value })}
                      placeholder="React, Next.js, Tailwind CSS"
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={addStat}
            className="bg-transparent border border-accent-violet text-accent-violet hover:bg-accent-violet/10"
          >
            <Plus className="w-4 h-4 mr-2" /> Add category
          </Button>
        </Section>

        {/* CHAPTER 05 — SAVE FILE */}
        <Section title="Chapter 05 · Save File" subtitle="Resume + progress meta">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Resume path" hint="Public path to the resume PDF (e.g. /resume/raaj-patre-resume.pdf).">
              <Input
                className={inputCls}
                value={saveFile.resumePath}
                onChange={(e) => setSaveFile({ ...saveFile, resumePath: e.target.value })}
              />
            </Field>
            <Field label="Version">
              <Input
                className={inputCls}
                value={saveFile.version}
                onChange={(e) => setSaveFile({ ...saveFile, version: e.target.value })}
                placeholder="v1.0.0"
              />
            </Field>
            <Field label="Last updated">
              <Input
                className={inputCls}
                value={saveFile.lastUpdated}
                onChange={(e) => setSaveFile({ ...saveFile, lastUpdated: e.target.value })}
                placeholder="MAY 2026"
              />
            </Field>
            <Field label="Est. graduation">
              <Input
                className={inputCls}
                value={saveFile.estGraduation}
                onChange={(e) => setSaveFile({ ...saveFile, estGraduation: e.target.value })}
                placeholder="2027"
              />
            </Field>
            <Field label="Progress % (0–100)">
              <Input
                type="number"
                min={0}
                max={100}
                className={inputCls}
                value={saveFile.progressPct}
                onChange={(e) =>
                  setSaveFile({ ...saveFile, progressPct: Number(e.target.value) })
                }
              />
            </Field>
          </div>
        </Section>

        {/* Bottom Save bar */}
        <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-bg-surface/95 backdrop-blur border-t border-border-pixel flex justify-end gap-3">
          {savedAt && (
            <span className="font-mono text-[11px] text-accent-teal self-center">
              Saved {savedAt}
            </span>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="bg-accent-violet text-white hover:brightness-110"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SaveIcon className="mr-2 h-4 w-4" />
            )}
            Save all changes
          </Button>
        </div>
      </form>
    </div>
  );
}
