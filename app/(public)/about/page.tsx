import { AboutClient } from "@/components/public/AboutClient";
import { origin, guild, factions, stats, saveFile } from "@/data/about";

export const metadata = {
  title: "About | Raaj Patre",
  description: `${origin.class} · LVL ${origin.level} — ${origin.bio.slice(0, 120)}…`,
};

// ─── Guild crest (8x8 pixel shield) ───────────────────────────────────
const CREST_GRID = [
  "........",
  ".gggggg.",
  ".gvvvvg.",
  ".gvggvg.",
  ".gvggvg.",
  ".gvvvvg.",
  "..gvvg..",
  "...gg...",
];

// ─── Pixel stat icons (8x8 grids) ──────────────────────────────────────
const ICON_PX: Record<string, [number, number][]> = {
  FRONTEND: [
    [4, 1], [3, 2], [4, 2], [2, 3], [3, 3], [4, 3], [1, 4], [2, 4], [3, 4], [4, 4],
    [2, 5], [3, 5], [5, 5], [1, 6], [4, 6], [5, 6], [0, 7], [5, 7],
  ],
  BACKEND: [
    [2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [3, 3], [4, 3], [6, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
    [2, 5], [3, 5], [4, 5], [5, 5], [3, 6], [4, 6],
  ],
  LANGUAGES: [
    [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [1, 2], [6, 2],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [1, 4], [6, 4],
    [2, 5], [3, 5], [4, 5], [5, 5],
    [1, 6], [6, 6],
    [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
  ],
  TOOLS: [
    [4, 1], [5, 1], [3, 2], [4, 2], [6, 2], [3, 3], [5, 3], [6, 3],
    [3, 4], [4, 4], [5, 4],
    [2, 5], [3, 5], [1, 6], [2, 6], [0, 7], [1, 7],
  ],
};

function PixelIcon({ name }: { name: string }) {
  const pixels = ICON_PX[name] || [];
  return (
    <svg className="cs-stat-icon" viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#3dd6ac" />
      ))}
    </svg>
  );
}

function Crest() {
  const cells: React.ReactNode[] = [];
  CREST_GRID.forEach((row, y) => {
    for (let x = 0; x < 8; x++) {
      const c = row[x];
      const cls = c === "g" ? "gold" : c === "v" ? "violet" : "px";
      cells.push(<span key={`${y}-${x}`} className={cls} />);
    }
  });
  return <div className="cs-crest" aria-hidden="true">{cells}</div>;
}

function Floppy() {
  return (
    <svg viewBox="0 0 16 16" width="120" height="120" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" fill="#12152b" />
      <rect x="1" y="1" width="14" height="1" fill="#1a1e38" />
      <rect x="1" y="14" width="14" height="1" fill="#0a0c1a" />
      <rect x="1" y="1" width="1" height="14" fill="#1a1e38" />
      <rect x="14" y="1" width="1" height="14" fill="#0a0c1a" />
      <rect x="3" y="2" width="10" height="3" fill="#2a2d4a" />
      <rect x="4" y="3" width="3" height="1" fill="#0a0c1a" />
      <rect x="11" y="3" width="1" height="1" fill="#0a0c1a" />
      <rect x="3" y="7" width="10" height="6" fill="#f5c542" />
      <rect x="3" y="7" width="10" height="1" fill="#ffd970" />
      <rect x="3" y="12" width="10" height="1" fill="#d9ad34" />
      <rect x="4" y="9" width="8" height="1" fill="#0a0c1a" />
      <rect x="4" y="11" width="6" height="1" fill="#0a0c1a" />
      <rect x="13" y="1" width="1" height="1" fill="#0a0c1a" />
      <rect x="14" y="2" width="1" height="1" fill="#0a0c1a" />
    </svg>
  );
}

function SmallFloppy() {
  return (
    <svg className="disk" viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="8" height="8" fill="#0a0c1a" />
      <rect x="1" y="1" width="5" height="2" fill="#2a2d4a" />
      <rect x="1" y="4" width="6" height="3" fill="#f5c542" />
      <rect x="2" y="5" width="4" height="1" fill="#0a0c1a" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <div id="about-root" className="relative">
        {/* Chapter 1 — Origin */}
        <section data-chapter="0" className="cs-chapter cs-origin">
          <div className="cs-stars-bg" aria-hidden="true" />
          <div className="cs-moon" aria-hidden="true" />
          <div className="cs-mountains" aria-hidden="true">
            <div className="cs-mlayer far" data-parallax="0.05" />
            <div className="cs-mlayer mid" data-parallax="0.12" />
            <div className="cs-mlayer near" data-parallax="0.22" />
          </div>

          <div className="cs-chapter-inner">
            <div className="cs-cascade">
              <div className="cs-ch-label">CHAPTER 01</div>
              <h1 className="cs-ch1-title">ORIGIN</h1>
              <div>
                <span className="cs-class-badge">
                  {origin.class} · LVL {origin.level}
                </span>
              </div>
              <p className="cs-bio">{origin.bio}</p>
              <div className="cs-location">
                <span className="pin" />
                {origin.location}
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 2 — Guild */}
        <section data-chapter="1" className="cs-chapter">
          <div className="cs-chapter-header">
            CHAPTER 02 <span className="slash">/</span> GUILD
          </div>
          <div className="cs-chapter-inner cs-guild-inner">
            <div className="cs-guild-card">
              <Crest />
              <div className="cs-guild-label">★ GUILD ★</div>
              <div className="cs-guild-name">
                {guild.institution.split(/\s+/).reduce<string[][]>(
                  (acc, word) => {
                    const last = acc[acc.length - 1];
                    if (last.join(" ").length + word.length < 14) {
                      last.push(word);
                    } else {
                      acc.push([word]);
                    }
                    return acc;
                  },
                  [[]]
                ).map((line, i, all) => (
                  <span key={i}>
                    {line.join(" ").toUpperCase()}
                    {i < all.length - 1 && <br />}
                  </span>
                ))}
              </div>
              <div className="cs-guild-role">{guild.role}</div>
              <div className="cs-guild-dur">{guild.duration}</div>
              <div className="cs-guild-loc">{guild.location}</div>
              <div className="cs-guild-divider" />
              <div className="cs-guild-flavor">&ldquo;{guild.flavor}&rdquo;</div>
            </div>
          </div>
        </section>

        {/* Chapter 3 — Factions */}
        <section data-chapter="2" className="cs-chapter">
          <div className="cs-chapter-header">
            CHAPTER 03 <span className="slash">/</span> FACTIONS
          </div>
          <div className="cs-chapter-inner">
            <div className="cs-factions-row">
              {factions.map((f) => (
                <article key={f.org} className={`cs-faction ${f.cls}`}>
                  <div className="accent" />
                  <div className="cs-faction-body">
                    <div className="cs-faction-name">{f.org}</div>
                    <div className="cs-faction-role">{f.role}</div>
                    <div className="cs-faction-dur">{f.duration}</div>
                    <div className="cs-faction-desc">{f.blurb}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter 4 — Stats */}
        <section data-chapter="3" className="cs-chapter">
          <div className="cs-chapter-header">
            CHAPTER 04 <span className="slash">/</span> STATS
          </div>
          <div
            className="cs-chapter-inner"
            style={{ ["--cs-lvl" as string]: `${saveFile.progressPct}%` }}
          >
            <div className="cs-cascade">
              <div className="cs-stat-grid">
                {stats.map((s) => (
                  <div key={s.label} className="cs-stat-panel">
                    <div className="cs-stat-cat">
                      <PixelIcon name={s.label} />
                      {s.label}
                    </div>
                    <div className="cs-stat-list">{s.skills.join(", ")}</div>
                  </div>
                ))}
              </div>
              <div className="cs-lvl-progress">
                <div className="row">
                  <span>
                    LVL {String(origin.level).padStart(2, "0")} ─ CHARACTER PROGRESS
                  </span>
                  <span className="a">
                    {saveFile.progressPct}% TO LVL {String(origin.level + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="cs-lvl-bar">
                  <div className="cs-lvl-fill" />
                </div>
                <div className="cs-lvl-cap">
                  Est. graduation: {saveFile.estGraduation} · Current XP from coursework, hackathons & ships.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 5 — Save File */}
        <section data-chapter="4" className="cs-chapter cs-save">
          <div className="cs-chapter-header">
            CHAPTER 05 <span className="slash">/</span> SAVE FILE
          </div>
          <div className="cs-chapter-inner">
            <div className="cs-cascade">
              <div className="cs-floppy-wrap"><Floppy /></div>
              <h2 className="cs-save-title">EXPORT SAVE FILE</h2>
              <div className="cs-save-sub">Download my resume as a plain document.</div>
              <div>
                <a
                  className="cs-save-btn"
                  href={saveFile.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <SmallFloppy /> DOWNLOAD RESUME.PDF
                </a>
              </div>
              <div className="cs-version">
                {saveFile.version} · LAST UPDATED {saveFile.lastUpdated}
              </div>
            </div>
          </div>
        </section>
      </div>

      <AboutClient />
    </>
  );
}
