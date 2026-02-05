import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";
import { AI_CONVERSATION, THERAPIST_CONVERSATION } from "../data/conversations";
import { VisualMetrics } from "./VisualIndicators";

// The shared opening line
const SHARED_ORIGIN = "I feel like nobody really understands what I'm going through.";

// Interior popup modal
function InteriorPopup({ isOpen, onClose, entry, speaker, side }) {
  if (!isOpen) return null;

  const isClient = speaker === "user";
  const isAI = side === "ai";

  const interior = isClient
    ? entry.userInterior
    : isAI
      ? null
      : entry.therapistInterior;

  const aiProcess = isAI && !isClient ? entry.aiProcess : null;

  const labelColor = isClient
    ? PALETTE.nodeUser
    : isAI
      ? PALETTE.accentCool
      : PALETTE.nodeTherapist;

  const title = isClient
    ? "Client Interior"
    : isAI
      ? "AI Process"
      : "Therapist Interior";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: PALETTE.bg,
            border: `1px solid ${labelColor}40`,
            borderRadius: 12,
            padding: 20,
            maxWidth: 500,
            maxHeight: "80vh",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}>
            <span style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: "0.12em",
              color: labelColor,
              textTransform: "uppercase",
            }}>
              {title}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: PALETTE.textMuted,
                fontSize: 18,
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ×
            </button>
          </div>

          {/* Client/Therapist interior content */}
          {interior && (
            <div>
              {[
                { label: "Body", text: interior.body },
                { label: "Feeling", text: interior.feeling },
                { label: isClient ? "Projection" : "Clinical Thinking", text: isClient ? interior.projection : interior.clinicalThinking },
                { label: isClient ? "Need" : "Countertransference", text: isClient ? interior.need : interior.countertransference },
              ].map(({ label, text }) => text && (
                <div key={label} style={{ marginBottom: 14 }}>
                  <span style={{
                    fontFamily: FONTS.mono,
                    fontSize: 9,
                    color: PALETTE.textMuted,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </span>
                  <div style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: PALETTE.textSecondary,
                    marginTop: 4,
                  }}>
                    {text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI process content */}
          {aiProcess && (
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: "rgba(126, 184, 212, 0.7)",
              fontStyle: "italic",
            }}>
              {aiProcess}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MessageBubble({ text, speaker, entry, side, onClickInterior }) {
  const isClient = speaker === "user";
  const isAI = speaker === "ai";

  const hasInterior = isClient
    ? entry?.userInterior
    : isAI
      ? entry?.aiProcess
      : entry?.therapistInterior;

  let bgColor, borderColor, align, labelColor;

  if (isClient) {
    bgColor = "rgba(232, 193, 112, 0.08)";
    borderColor = "rgba(232, 193, 112, 0.15)";
    labelColor = PALETTE.nodeUser;
    align = "flex-end";
  } else if (isAI) {
    bgColor = "rgba(126, 184, 212, 0.06)";
    borderColor = "rgba(126, 184, 212, 0.12)";
    labelColor = PALETTE.accentCool;
    align = "flex-start";
  } else {
    bgColor = "rgba(196, 160, 122, 0.06)";
    borderColor = "rgba(196, 160, 122, 0.12)";
    labelColor = PALETTE.nodeTherapist;
    align = "flex-start";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        marginBottom: 12,
      }}
    >
      {/* Clickable label */}
      <button
        onClick={() => hasInterior && onClickInterior()}
        style={{
          fontSize: 8,
          fontFamily: FONTS.mono,
          color: hasInterior ? labelColor : PALETTE.textMuted,
          marginBottom: 3,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "transparent",
          border: "none",
          cursor: hasInterior ? "pointer" : "default",
          padding: "2px 0",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {isClient ? "client" : isAI ? "AI" : "therapist"}
        {hasInterior && (
          <span style={{
            fontSize: 10,
            opacity: 0.6,
          }}>
            ↗
          </span>
        )}
      </button>
      <div
        style={{
          maxWidth: "90%",
          padding: "10px 14px",
          borderRadius: isClient
            ? "14px 14px 4px 14px"
            : "14px 14px 14px 4px",
          background: bgColor,
          border: `1px solid ${borderColor}`,
          fontFamily: FONTS.body,
          fontSize: 13,
          lineHeight: 1.5,
          color: PALETTE.textPrimary,
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

function ConversationColumn({ side, step }) {
  const isAI = side === "ai";
  const conversation = isAI ? AI_CONVERSATION : THERAPIST_CONVERSATION;
  const columnRef = useRef(null);
  const maxStep = conversation.length;
  const [popup, setPopup] = useState({ isOpen: false, entry: null, speaker: null });

  useEffect(() => {
    if (columnRef.current) {
      columnRef.current.scrollTop = columnRef.current.scrollHeight;
    }
  }, [step]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: isAI
          ? "rgba(126, 184, 212, 0.01)"
          : "rgba(196, 160, 122, 0.02)",
        borderLeft: isAI ? "none" : `1px solid ${PALETTE.border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: PALETTE.bg,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: isAI ? PALETTE.accentCool : PALETTE.nodeTherapist,
          }}
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: "0.1em",
            color: isAI ? PALETTE.accentCool : PALETTE.nodeTherapist,
            textTransform: "uppercase",
          }}
        >
          {isAI ? "→ Phone (AI Companion)" : "→ Therapist (Human)"}
        </span>
      </div>

      {/* Breathing background for therapist side */}
      {!isAI && (
        <motion.div
          animate={{
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${PALETTE.nodeTherapist}15 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Conversation content */}
      <div
        ref={columnRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
        }}
      >
        {conversation.slice(0, step + 1).map((entry, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <MessageBubble
              text={entry.text}
              speaker={entry.speaker}
              entry={entry}
              side={side}
              onClickInterior={() => setPopup({ isOpen: true, entry, speaker: entry.speaker })}
            />
          </div>
        ))}

        {/* Visual metrics - always show */}
        <div style={{ marginTop: 8 }}>
          <VisualMetrics
            mode={side}
            step={step}
            maxSteps={maxStep - 1}
          />
        </div>
      </div>

      {/* Interior popup */}
      <InteriorPopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ isOpen: false, entry: null, speaker: null })}
        entry={popup.entry}
        speaker={popup.speaker}
        side={side}
      />
    </div>
  );
}

export default function DivergenceView() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const intervalRef = useRef(null);

  const maxStep = Math.max(AI_CONVERSATION.length, THERAPIST_CONVERSATION.length) - 1;

  const advance = useCallback(() => {
    setStep((s) => {
      if (s >= maxStep) {
        setPlaying(false);
        return s;
      }
      return s + 1;
    });
  }, [maxStep]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showIntro) {
        if (e.key === "Enter" || e.key === " ") {
          setShowIntro(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          if (step < maxStep) advance();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goBack();
          break;
        case "r":
        case "R":
          setStep(0);
          setPlaying(false);
          break;
        case "p":
        case "P":
          if (step >= maxStep) setStep(0);
          setPlaying((p) => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, step, maxStep, advance, goBack]);

  // Auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(advance, 8000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, advance]);

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: PALETTE.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 540, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: "0.2em",
              color: PALETTE.textMuted,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Assistive Relational Intelligence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(28px, 6vw, 36px)",
              fontWeight: 400,
              color: PALETTE.textPrimary,
              lineHeight: 1.3,
              margin: "0 0 20px 0",
            }}
          >
            Two Rooms:{" "}
            <span style={{ color: PALETTE.accent }}>Field Demo</span>
          </motion.h1>
          {/* Two rooms visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              margin: "24px 0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 60,
                height: 50,
                border: `1px solid ${PALETTE.accentCool}40`,
                borderRadius: 4,
                background: PALETTE.void,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 20 }}>📱</span>
              </div>
              <span style={{
                fontFamily: FONTS.mono,
                fontSize: 8,
                color: PALETTE.accentCool,
                letterSpacing: "0.1em",
              }}>
                ONE PERSON
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 60,
                height: 50,
                border: `1px solid ${PALETTE.nodeTherapist}40`,
                borderRadius: 4,
                background: PALETTE.interiorTherapist,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 20 }}>👤 👤</span>
              </div>
              <span style={{
                fontFamily: FONTS.mono,
                fontSize: 8,
                color: PALETTE.nodeTherapist,
                letterSpacing: "0.1em",
              }}>
                TWO PEOPLE
              </span>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: FONTS.body,
              fontSize: 14,
              color: PALETTE.textSecondary,
              lineHeight: 1.7,
              margin: "0 0 12px 0",
            }}
          >
            A person in distress reaches out.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              fontFamily: FONTS.body,
              fontSize: 13,
              color: PALETTE.textMuted,
              lineHeight: 1.6,
              margin: "0 0 32px 0",
            }}
          >
            Two rooms. One has someone inside. One doesn't.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => setShowIntro(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "transparent",
              border: `1px solid ${PALETTE.accent}`,
              color: PALETTE.accent,
              fontFamily: FONTS.mono,
              fontSize: 12,
              letterSpacing: "0.1em",
              padding: "12px 32px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ENTER
          </motion.button>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              marginTop: 48,
              fontFamily: FONTS.mono,
              fontSize: 9,
              color: PALETTE.textMuted,
            }}
          >
            <div style={{ marginBottom: 8 }}>Skillman · ARI Framework</div>
            <a
              href="https://linktr.ee/jocelynskillmanLMHC"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: PALETTE.accent, textDecoration: "none", opacity: 0.7 }}
            >
              linktr.ee/jocelynskillmanLMHC
            </a>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        background: PALETTE.bg,
        minHeight: "100vh",
        fontFamily: FONTS.body,
        color: PALETTE.textPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 16,
            color: PALETTE.textPrimary,
          }}
        >
          Two Rooms: <span style={{ color: PALETTE.accent }}>Field Demo</span>
        </div>
      </div>

      {/* Shared origin - shown once at top */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${PALETTE.border}`,
          background: "rgba(232, 193, 112, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: PALETTE.nodeUser,
              boxShadow: `0 0 8px ${PALETTE.nodeUser}50`,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: "0.12em",
              color: PALETTE.nodeUser,
              textTransform: "uppercase",
            }}
          >
            Human in distress
          </span>
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 14,
            fontStyle: "italic",
            lineHeight: 1.5,
            color: PALETTE.textSecondary,
            textAlign: "center",
            maxWidth: 500,
            margin: "0 auto 12px",
          }}
        >
          "{SHARED_ORIGIN}"
        </div>
        {/* Divergence visual */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width="200" height="32" viewBox="0 0 200 32">
            {/* Center point */}
            <circle cx="100" cy="4" r="3" fill={PALETTE.nodeUser} />
            {/* Left branch to phone */}
            <path
              d="M100 7 L100 12 L50 12 L50 28"
              fill="none"
              stroke={PALETTE.accentCool}
              strokeWidth="1"
              opacity="0.5"
            />
            <circle cx="50" cy="30" r="4" fill={PALETTE.accentCool} opacity="0.6" />
            <text x="50" y="28" textAnchor="middle" fill={PALETTE.accentCool} fontSize="8" fontFamily={FONTS.mono} opacity="0.8">📱</text>
            {/* Right branch to therapist */}
            <path
              d="M100 7 L100 12 L150 12 L150 28"
              fill="none"
              stroke={PALETTE.nodeTherapist}
              strokeWidth="1"
              opacity="0.5"
            />
            <circle cx="150" cy="30" r="4" fill={PALETTE.nodeTherapist} opacity="0.6" />
            <text x="150" y="28" textAnchor="middle" fill={PALETTE.nodeTherapist} fontSize="8" fontFamily={FONTS.mono} opacity="0.8">👤</text>
          </svg>
        </div>
      </div>

      {/* Split view - full conversations */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <ConversationColumn side="ai" step={step} />
        <ConversationColumn side="therapist" step={step} />
      </div>

      {/* Progress bar */}
      <div style={{ padding: "8px 16px", borderTop: `1px solid ${PALETTE.border}` }}>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: maxStep + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                flex: 1,
                height: 4,
                background: i <= step ? PALETTE.accent : PALETTE.border,
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                opacity: i <= step ? 1 : 0.4,
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls - centered and prominent */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: `1px solid ${PALETTE.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Main navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={goBack}
            disabled={step <= 0}
            style={{
              background: step <= 0 ? "transparent" : "rgba(255,255,255,0.05)",
              border: `1px solid ${step <= 0 ? PALETTE.border : PALETTE.accent}`,
              color: step <= 0 ? PALETTE.textMuted : PALETTE.accent,
              fontFamily: FONTS.mono,
              fontSize: 14,
              padding: "10px 20px",
              borderRadius: 4,
              cursor: step <= 0 ? "default" : "pointer",
              opacity: step <= 0 ? 0.4 : 1,
              transition: "all 0.2s",
            }}
          >
            ← Back
          </button>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              color: PALETTE.textSecondary,
              minWidth: 60,
              textAlign: "center",
            }}
          >
            {step + 1} / {maxStep + 1}
          </div>

          <button
            onClick={advance}
            disabled={step >= maxStep}
            style={{
              background: step >= maxStep ? "transparent" : "rgba(212, 136, 106, 0.1)",
              border: `1px solid ${step >= maxStep ? PALETTE.border : PALETTE.accent}`,
              color: step >= maxStep ? PALETTE.textMuted : PALETTE.accent,
              fontFamily: FONTS.mono,
              fontSize: 14,
              padding: "10px 20px",
              borderRadius: 4,
              cursor: step >= maxStep ? "default" : "pointer",
              opacity: step >= maxStep ? 0.4 : 1,
              transition: "all 0.2s",
            }}
          >
            Next →
          </button>
        </div>

        {/* Secondary controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => {
              if (step >= maxStep) {
                setStep(0);
                setPlaying(false);
              } else {
                setPlaying(!playing);
              }
            }}
            style={{
              background: "transparent",
              border: `1px solid ${PALETTE.border}`,
              color: PALETTE.textMuted,
              fontFamily: FONTS.mono,
              fontSize: 9,
              padding: "4px 12px",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            {step >= maxStep ? "Reset" : playing ? "Pause auto" : "Auto-play"}
          </button>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 8,
              color: PALETTE.textMuted,
              opacity: 0.6,
            }}
          >
            or use ← → keys
          </span>
        </div>
      </div>
      {/* Footer */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: FONTS.mono,
          fontSize: 8,
          color: PALETTE.textMuted,
        }}
      >
        <span>Skillman · ARI Framework</span>
        <a
          href="https://linktr.ee/jocelynskillmanLMHC"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: PALETTE.accent, textDecoration: "none", opacity: 0.8 }}
        >
          Linktree
        </a>
      </div>
    </div>
  );
}
