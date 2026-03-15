import { useState } from "react";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    title: "Code editor",
    desc: "Real syntax highlighting and multi-language support. Feels just like their local environment.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
        <polygon points="23,7 16,12 23,17" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    title: "1-on-1 video calls",
    desc: "HD video interviews. Mic, camera toggle, screen sharing, and session recording built in.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Auto feedback",
    desc: "Instant pass/fail results based on test cases. Confetti on success, detailed failure breakdown on errors.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: "Real-time chat",
    desc: "In-session messaging. Share links, code snippets, and notes without leaving the call.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: "Secure code execution",
    desc: "All code runs in isolated sandboxed environments. No security risks, consistent results every time.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Room locking",
    desc: "Rooms are capped at 2 participants with authentication. Your sessions stay private and secure.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Create a room",
    desc: "Set up a locked session with one click. Share the invite link with your candidate.",
    img: "room.jpg",
  },
  {
    num: "02",
    title: "Join the call",
    desc: "Candidate authenticates and joins. Video, chat, and editor activate instantly.",
    img: "video.jpg",
  },
  {
    num: "03",
    title: "Code together",
    desc: "Candidate solves problems live. Watch, comment, and collaborate in real time.",
    img: "code.jpg",
  },
  {
    num: "04",
    title: "Get feedback",
    desc: "Instant test results and session summary. Recording available to review anytime.",
    img: "feedback.png",
  },
];

const CODE_LINES = [
  {
    num: "1",
    tokens: [
      { t: "function ", c: "#a78bfa" },
      { t: "twoSum", c: "#34d399" },
      { t: "(nums, target) {", c: "#e2e8f0" },
    ],
  },
  {
    num: "2",
    tokens: [
      { t: "  const ", c: "#a78bfa" },
      { t: "seen = ", c: "#e2e8f0" },
      { t: "new ", c: "#a78bfa" },
      { t: "Map", c: "#60a5fa" },
      { t: "();", c: "#e2e8f0" },
    ],
  },
  {
    num: "3",
    tokens: [
      { t: "  for ", c: "#a78bfa" },
      { t: "(let i = 0; i < nums.length; i++) {", c: "#e2e8f0" },
    ],
  },
  {
    num: "4",
    tokens: [
      { t: "    const ", c: "#a78bfa" },
      { t: "comp = target - nums[i];", c: "#e2e8f0" },
    ],
    highlight: true,
  },
  {
    num: "5",
    tokens: [
      { t: "    if ", c: "#a78bfa" },
      { t: "(seen.has(comp)) ", c: "#e2e8f0" },
      { t: "return ", c: "#a78bfa" },
      { t: "[seen.get(comp), i];", c: "#e2e8f0" },
    ],
  },
  { num: "6", tokens: [{ t: "    seen.set(nums[i], i);", c: "#e2e8f0" }] },
  { num: "7", tokens: [{ t: "  }", c: "#e2e8f0" }] },
  { num: "8", tokens: [{ t: "}", c: "#e2e8f0" }] },
];

const TESTS = [
  { label: "Example 1: [2,7,11,15]", status: "pass", time: "12ms" },
  { label: "Example 2: [3,2,4]", status: "pass", time: "8ms" },
  { label: "Edge: duplicates", status: "pass", time: "6ms" },
  { label: "Large input test", status: "pending", time: "—" },
];

const DASHBOARD_CANDIDATES = [
  { name: "Alex Rivera", problem: "Two Sum", score: 92, status: "pass", time: "18 min", date: "Today" },
  { name: "Jamie Song", problem: "Valid Parentheses", score: 78, status: "pass", time: "24 min", date: "Today" },
  { name: "Morgan Blake", problem: "Binary Search", score: 45, status: "fail", time: "31 min", date: "Yesterday" },
  { name: "Taylor Kim", problem: "Merge Intervals", score: 88, status: "pass", time: "22 min", date: "Yesterday" },
];

function Avatar({ initials, bg, color, size = 34 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ── Tab content components ──────────────────────────────────────────────────

function CodeEditorTab({ dark }) {
  return (
    <div
      className="demo-inner"
      style={{ display: "grid", gridTemplateColumns: "1fr 300px", minHeight: 260 }}
    >
      <div
        style={{
          padding: 16,
          background: "#0d1117",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          lineHeight: 1.8,
        }}
      >
        {CODE_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              background: line.highlight ? "rgba(99,102,241,0.12)" : "transparent",
              borderLeft: line.highlight ? "2px solid #6366F1" : "2px solid transparent",
              paddingLeft: 6,
              marginLeft: -6,
            }}
          >
            <span style={{ color: "#64748b", marginRight: 10 }}>{line.num}</span>
            {line.tokens.map((tok, j) => (
              <span key={j} style={{ color: tok.c }}>{tok.t}</span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderLeft: "0.5px solid var(--border)" }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, color: "var(--muted)" }}>
          Test results
        </div>
        {TESTS.map((t) => (
          <div
            key={t.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 0",
              borderBottom: "0.5px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                flexShrink: 0,
                background:
                  t.status === "pass"
                    ? "var(--success)"
                    : t.status === "fail"
                    ? "var(--err)"
                    : "var(--border)",
              }}
            />
            <span style={{ fontSize: 12 }}>{t.label}</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>
              {t.time}
            </span>
          </div>
        ))}
        <div
          style={{
            marginTop: 14,
            padding: 10,
            background: "var(--bg)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          3/4 passed · O(n) time complexity
        </div>
      </div>
    </div>
  );
}

function VideoCallTab({ dark }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div style={{ background: "#0d1117", minHeight: 260, display: "flex", flexDirection: "column" }}>
      {/* Video grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 12, flex: 1 }}>
        {/* Participant 1 — camera on */}
        <div
          style={{
            background: "#1a2332",
            borderRadius: 12,
            minHeight: 160,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #6366F1",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1e3a5f 0%, #0f2942 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar initials="AR" bg="#3B82F6" color="#fff" size={52} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "rgba(0,0,0,0.6)",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 11,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10B981",
                flexShrink: 0,
              }}
            />
            Alex Rivera (You)
          </div>
          {/* Speaking indicator */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(99,102,241,0.85)",
              borderRadius: 6,
              padding: "2px 7px",
              fontSize: 10,
              color: "#fff",
            }}
          >
            Speaking
          </div>
        </div>

        {/* Participant 2 — camera off */}
        <div
          style={{
            background: "#111827",
            borderRadius: 12,
            minHeight: 160,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "0.5px solid #1e293b",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Avatar initials="JS" bg="#059669" color="#fff" size={52} />
            <span style={{ fontSize: 11, color: "#64748b" }}>Camera off</span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "rgba(0,0,0,0.6)",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 11,
              color: "#fff",
            }}
          >
            Jamie Song
          </div>
          {/* Muted badge */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(239,68,68,0.85)",
              borderRadius: 6,
              padding: "2px 7px",
              fontSize: 10,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
              <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            Muted
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "12px 16px",
          borderTop: "0.5px solid #1e293b",
        }}
      >
        {/* Mic toggle */}
        <button
          onClick={() => setMicOn((v) => !v)}
          title={micOn ? "Mute mic" : "Unmute mic"}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: micOn ? "#1e293b" : "#EF4444",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {micOn ? (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
              <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* Camera toggle */}
        <button
          onClick={() => setCamOn((v) => !v)}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: camOn ? "#1e293b" : "#EF4444",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {camOn ? (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="23,7 16,12 23,17" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          ) : (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34" />
              <polygon points="23,7 16,12 23,17" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>

        {/* Screen share */}
        <button
          title="Share screen"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "#1e293b",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </button>

        {/* End call */}
        <button
          title="End call"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "#EF4444",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
          </svg>
        </button>

        {/* Timer */}
        <div
          style={{
            marginLeft: 8,
            fontSize: 13,
            color: "#94A3B8",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          24:17
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ dark }) {
  const stats = [
    { label: "Sessions this week", value: "14", delta: "+3", up: true },
    { label: "Pass rate", value: "71%", delta: "+5%", up: true },
    { label: "Avg duration", value: "23 min", delta: "-2 min", up: true },
  ];

  return (
    <div style={{ padding: 20, minHeight: 260 }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg)",
              border: "0.5px solid var(--border)",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{s.value}</span>
              <span
                style={{
                  fontSize: 11,
                  color: s.up ? "var(--success)" : "var(--err)",
                  fontWeight: 500,
                }}
              >
                {s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent candidates table */}
      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)", marginBottom: 10 }}>
        Recent candidates
      </div>
      <div
        style={{
          background: "var(--bg)",
          border: "0.5px solid var(--border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {DASHBOARD_CANDIDATES.map((c, i) => (
          <div
            key={c.name}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto auto auto",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderBottom:
                i < DASHBOARD_CANDIDATES.length - 1 ? "0.5px solid var(--border)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                initials={c.name.split(" ").map((n) => n[0]).join("")}
                bg={dark ? "#1e3a5f" : "#DBEAFE"}
                color={dark ? "#60a5fa" : "#1D4ED8"}
                size={28}
              />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{c.problem}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{c.score}</span>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 6,
                background:
                  c.status === "pass"
                    ? dark ? "#14532d" : "#D1FAE5"
                    : dark ? "#450a0a" : "#FEE2E2",
                color:
                  c.status === "pass"
                    ? dark ? "#4ade80" : "#065F46"
                    : dark ? "#f87171" : "#991B1B",
                fontWeight: 500,
              }}
            >
              {c.status === "pass" ? "Passed" : "Failed"}
            </span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function HomePage() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isSignedIn } = useUser();

  const theme = {
    "--ind": dark ? "#6366F1" : "#4F46E5",
    "--ind-light": dark ? "#1e1b4b" : "#EEF2FF",
    "--bg": dark ? "#0F172A" : "#F9FAFB",
    "--card": dark ? "#1E293B" : "#FFFFFF",
    "--text": dark ? "#F1F5F9" : "#111827",
    "--muted": dark ? "#94A3B8" : "#6B7280",
    "--border": dark ? "#334155" : "#E5E7EB",
    "--success": "#10B981",
    "--warn": "#F59E0B",
    "--err": "#EF4444",
  };

  const TAB_LABELS = ["Code editor", "Video call", "Dashboard"];

  return (
    <div
      style={{
        ...theme,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        .feature-card:hover  { border-color: var(--ind) !important; }
        .nav-link:hover      { color: var(--text) !important; }
        .btn-ghost-sm:hover  { background: var(--bg) !important; }
        .btn-primary:hover   { opacity: 0.88; }
        .btn-lg-ghost:hover  { background: var(--bg) !important; }
        .plan-btn-ghost:hover{ background: var(--bg) !important; }
        .footer-link:hover   { color: var(--text) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.20s; }
        .fade-up-4 { animation-delay: 0.28s; }
        .fade-up-5 { animation-delay: 0.36s; }
        @media (max-width: 900px) {
          .hero-grid      { grid-template-columns: 1fr !important; }
          .hero-right     { grid-template-columns: 1fr !important; min-height: 280px !important; }
          .feat-grid      { grid-template-columns: 1fr 1fr !important; }
          .step-grid      { grid-template-columns: 1fr 1fr !important; }
          .demo-inner     { grid-template-columns: 1fr !important; }
          .dash-stats     { grid-template-columns: 1fr 1fr !important; }
          .dash-row       { grid-template-columns: 1fr auto auto !important; }
        }
        @media (max-width: 560px) {
          .feat-grid      { grid-template-columns: 1fr !important; }
          .step-grid      { grid-template-columns: 1fr !important; }
          .hero-right     { display: none !important; }
          h1              { font-size: 30px !important; }
        }
      `}</style>

      {/* ════ NAV ════ */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: 64,
          background: "var(--card)",
          borderBottom: "0.5px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/logo.png"
            alt="Interviewr logo"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 20, fontWeight: 500 }}>Interviewr</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Smart Conversation. Better Hiring.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Theme toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className="btn-ghost-sm"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "0.5px solid var(--border)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted)",
              transition: "background 0.2s",
            }}
          >
            {dark ? (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <SignInButton mode="modal">
            <button
              className="btn-ghost-sm"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 14,
                border: "0.5px solid var(--border)",
                color: "var(--text)",
                background: "transparent",
                transition: "background 0.2s",
              }}
            >
              Sign in
            </button>
          </SignInButton>

          <SignInButton mode="modal">
            <button
              className="btn-primary"
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                background: "var(--ind)",
                color: "#fff",
                border: "none",
                transition: "opacity 0.2s",
              }}
            >
              Get started free
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 2rem 60px" }}>
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          {/* Left — copy */}
          <div>
            <div
              className="fade-up fade-up-1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                background: "var(--ind-light)",
                color: "var(--ind)",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ind)" }} />
              Now with AI-powered feedback
            </div>

            <h1
              className="fade-up fade-up-2"
              style={{
                fontSize: 46,
                fontWeight: 500,
                lineHeight: 1.15,
                marginBottom: 20,
                letterSpacing: "-0.5px",
              }}
            >
              The modern platform for{" "}
              <em style={{ fontStyle: "normal", color: "var(--ind)" }}>technical interviews</em>
            </h1>

            <p
              className="fade-up fade-up-3"
              style={{
                fontSize: 17,
                color: "var(--muted)",
                lineHeight: 1.7,
                marginBottom: 32,
                maxWidth: 460,
              }}
            >
              Real-time video calls, a VSCode-powered code editor, screen sharing, and instant
              feedback — everything you need to run or ace a technical interview.
            </p>

            <div className="fade-up fade-up-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {isSignedIn ? (
                <Link to="/problems">
                  <button
                    className="btn-primary"
                    style={{
                      padding: "12px 28px",
                      fontSize: 15,
                      fontWeight: 500,
                      borderRadius: 10,
                      background: "var(--ind)",
                      color: "#fff",
                      border: "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    Start interviewing free
                  </button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button
                    className="btn-primary"
                    style={{
                      padding: "12px 28px",
                      fontSize: 15,
                      fontWeight: 500,
                      borderRadius: 10,
                      background: "var(--ind)",
                      color: "#fff",
                      border: "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    Start interviewing free
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Right — two cards */}
          <div
            className="hero-right"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minHeight: 420 }}
          >
            {/* Photo card */}
            <div
              style={{
                background: "var(--card)",
                borderRadius: 16,
                border: "0.5px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <img
                src="/hero.jpg"
                alt="Technical interview platform"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Code editor card */}
            <div
              style={{
                background: "var(--card)",
                borderRadius: 16,
                border: "0.5px solid var(--border)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: "#0d1117",
                  borderBottom: "0.5px solid #1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
                  <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
                <span
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    marginLeft: 6,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  interview-session.tsx
                </span>
              </div>
              <div
                style={{
                  padding: 12,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  background: "#0d1117",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    lineHeight: 1.75,
                    flex: 1,
                  }}
                >
                  {CODE_LINES.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        background: line.highlight ? "rgba(99,102,241,0.12)" : "transparent",
                        borderLeft: line.highlight ? "2px solid #6366F1" : "2px solid transparent",
                        paddingLeft: 5,
                        marginLeft: -5,
                      }}
                    >
                      <span style={{ color: "#64748b", marginRight: 8 }}>{line.num}</span>
                      {line.tokens.map((tok, j) => (
                        <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                      ))}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    background: "var(--bg)",
                    borderRadius: 8,
                    border: "0.5px solid var(--border)",
                    flexShrink: 0,
                  }}
                >
                  <Avatar initials="AR" bg="#DBEAFE" color="#1D4ED8" size={26} />
                  <Avatar initials="JS" bg="#D1FAE5" color="#065F46" size={26} />
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 2 }}>
                    Live • 24:17
                  </span>
                  <div
                    style={{
                      marginLeft: "auto",
                      background: dark ? "#14532d" : "#DCFCE7",
                      color: dark ? "#4ade80" : "#15803D",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 5,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    All tests passing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ FEATURES ════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 2rem" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--ind)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Features
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 500, marginBottom: 12, letterSpacing: "-0.3px" }}>
          Everything in one place
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--muted)",
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 40,
          }}
        >
          From scheduling to feedback, Interviewr covers every step of the technical interview
          process.
        </p>
        <div
          className="feat-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card"
              style={{
                background: "var(--card)",
                border: "0.5px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ padding: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "var(--ind-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                    color: "var(--ind)",
                  }}
                >
                  {f.icon}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ LIVE DEMO ════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 60px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--ind)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Live demo
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 6 }}>
          A real interview environment
        </h2>
        <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 20 }}>
          Candidates code, you watch. Test cases run instantly. Feedback is automatic.
        </p>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {TAB_LABELS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                fontSize: 13,
                border:
                  activeTab === i
                    ? "0.5px solid var(--ind)"
                    : "0.5px solid var(--border)",
                background: activeTab === i ? "var(--ind)" : "var(--card)",
                color: activeTab === i ? "#fff" : "var(--muted)",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div
          style={{
            background: "var(--card)",
            border: "0.5px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Shared header bar */}
          <div
            style={{
              height: 48,
              background: "var(--bg)",
              borderBottom: "0.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 12,
            }}
          >
            {activeTab === 0 && (
              <>
                <span style={{ fontSize: 13, fontWeight: 500 }}>two-sum.js</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: dark ? "#14532d" : "#D1FAE5",
                    color: dark ? "#4ade80" : "#065F46",
                  }}
                >
                  Live session
                </span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                  2 participants
                </span>
              </>
            )}
            {activeTab === 1 && (
              <>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Video call</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: dark ? "#14532d" : "#D1FAE5",
                    color: dark ? "#4ade80" : "#065F46",
                  }}
                >
                  HD · Encrypted
                </span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                  2 participants
                </span>
              </>
            )}
            {activeTab === 2 && (
              <>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Hiring dashboard</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: dark ? "#1e3a5f" : "#DBEAFE",
                    color: dark ? "#60a5fa" : "#1D4ED8",
                  }}
                >
                  This week
                </span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                  4 candidates
                </span>
              </>
            )}
          </div>

          {/* Tab content */}
          {activeTab === 0 && <CodeEditorTab dark={dark} />}
          {activeTab === 1 && <VideoCallTab dark={dark} />}
          {activeTab === 2 && <DashboardTab dark={dark} />}
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 2rem 60px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--ind)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          How it works
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 500, marginBottom: 12, letterSpacing: "-0.3px" }}>
          From invite to feedback in minutes
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--muted)",
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 32,
          }}
        >
          A simple, distraction-free flow for both interviewers and candidates.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                background: "var(--card)",
                border: "0.5px solid var(--border)",
                borderRadius: 16,
                boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`/${s.img}`}
                  alt={s.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "20px 22px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ind)", marginBottom: 6 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 60px" }}>
        <div
          style={{
            background: "var(--ind)",
            borderRadius: 20,
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <h2
            style={{
              color: "#fff",
              fontSize: 32,
              fontWeight: 500,
              marginBottom: 12,
              position: "relative",
            }}
          >
            Ready to run better interviews?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 16,
              marginBottom: 28,
              position: "relative",
            }}
          >
            Join thousands of engineers and hiring teams using Interviewr every day.
          </p>
          <SignInButton mode="modal">
            <button
              style={{
                background: "#fff",
                color: "var(--ind)",
                padding: "12px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              Get started for free
            </button>
          </SignInButton>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer
        style={{
          borderTop: "0.5px solid var(--border)",
          padding: "32px 2rem",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          <img
            src="/logo.png"
            alt="Interviewr logo"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 20, fontWeight: 500 }}>Interviewr</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Smart Conversation. Better Hiring.
            </span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>© 2026 Interviewr</div>
      </footer>
    </div>
  );
}