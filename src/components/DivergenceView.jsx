import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";
import { AI_CONVERSATION, THERAPIST_CONVERSATION } from "../data/conversations";
import { VisualMetrics } from "./VisualIndicators";
import { InteriorPanel, AIVoid } from "./InteriorPanel";

// The shared opening line
const SHARED_ORIGIN = "I feel like nobody really understands what I'm going through.";

function MessageBubble({ text, speaker }) {
  const isClient = speaker === "user";
  const isAI = speaker === "ai";

  let bgColor, borderColor, align;

  if (isClient) {
    bgColor = "rgba(232, 193, 112, 0.08)";
    borderColor = "rgba(232, 193, 112, 0.15)";
    align = "flex-end";
  } else if (isAI) {
    bgColor = "rgba(126, 184, 212, 0.06)";
    borderColor = "rgba(126, 184, 212, 0.12)";
    align = "flex-start";
  } else {
    bgColor = "rgba(196, 160, 122, 0.06)";
    borderColor = "rgba(196, 160, 122, 0.12)";
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
      <div
        style={{
          fontSize: 8,
          fontFamily: FONTS.mono,
          color: PALETTE.textMuted,
          marginBottom: 3,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {isClient ? "client" : isAI ? "AI" : "therapist"}
      </div>
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

function ConversationColumn({ side, step, viewMode, expandedPanels, onTogglePanel }) {
  const isAI = side === "ai";
  const conversation = isAI ? AI_CONVERSATION : THERAPIST_CONVERSATION;
  const columnRef = useRef(null);
  const maxStep = conversation.length;

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
        {conversation.slice(0, step + 1).map((entry, i) => {
          const isUser = entry.speaker === "user";
          return (
            <div key={i} style={{ marginBottom: 16 }}>
              <MessageBubble text={entry.text} speaker={entry.speaker} />

              {viewMode === "detailed" && (
                <>
                  {/* Client interior */}
                  {entry.userInterior && (
                    <InteriorPanel
                      interior={entry.userInterior}
                      role="user"
                      isExpanded={expandedPanels[`${side}-user-${i}`] !== false}
                      onToggle={() => onTogglePanel(`${side}-user-${i}`)}
                    />
                  )}

                  {/* AI process */}
                  {isAI && entry.aiProcess && (
                    <AIVoid
                      process={entry.aiProcess}
                      isExpanded={expandedPanels[`ai-process-${i}`] !== false}
                      onToggle={() => onTogglePanel(`ai-process-${i}`)}
                    />
                  )}

                  {/* Therapist interior */}
                  {!isAI && entry.therapistInterior && (
                    <InteriorPanel
                      interior={entry.therapistInterior}
                      role="therapist"
                      isExpanded={expandedPanels[`therapist-interior-${i}`] !== false}
                      onToggle={() => onTogglePanel(`therapist-interior-${i}`)}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Visual metrics in visual mode */}
        {viewMode === "visual" && (
          <div style={{ marginTop: 8 }}>
            <VisualMetrics
              mode={side}
              step={step}
              maxSteps={maxStep - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DivergenceView() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [viewMode, setViewMode] = useState("visual");
  const [showIntro, setShowIntro] = useState(true);
  const [expandedPanels, setExpandedPanels] = useState({});
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

  const togglePanel = (key) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

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
        case "v":
        case "V":
          setViewMode((v) => (v === "visual" ? "detailed" : "visual"));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, step, maxStep, advance, goBack]);

  // Auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(advance, 4000);
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
            Semantic Isolation{" "}
            <span style={{ color: PALETTE.accent }}>Drift</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: FONTS.body,
              fontSize: 15,
              color: PALETTE.textSecondary,
              lineHeight: 1.7,
              margin: "0 0 16px 0",
            }}
          >
            A person in distress reaches out. Two paths: their phone, or a therapist.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: FONTS.body,
              fontSize: 13,
              color: PALETTE.textMuted,
              lineHeight: 1.6,
              margin: "0 0 36px 0",
            }}
          >
            Watch what happens when one side of the conversation has no inside at all.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
            transition={{ delay: 0.8 }}
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
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 16,
            color: PALETTE.textPrimary,
          }}
        >
          Semantic Isolation <span style={{ color: PALETTE.accent }}>Drift</span>
        </div>

        {/* View toggle */}
        <div
          style={{
            display: "flex",
            gap: 0,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {[
            { key: "visual", label: "Visual" },
            { key: "detailed", label: "Detailed" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              style={{
                background: viewMode === key ? "rgba(255,255,255,0.06)" : "transparent",
                border: "none",
                color: viewMode === key ? PALETTE.textPrimary : PALETTE.textMuted,
                fontFamily: FONTS.mono,
                fontSize: 9,
                letterSpacing: "0.08em",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
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
        <ConversationColumn
          side="ai"
          step={step}
          viewMode={viewMode}
          expandedPanels={expandedPanels}
          onTogglePanel={togglePanel}
        />
        <ConversationColumn
          side="therapist"
          step={step}
          viewMode={viewMode}
          expandedPanels={expandedPanels}
          onTogglePanel={togglePanel}
        />
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

      {/* Controls */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={goBack}
          disabled={step <= 0}
          style={{
            background: "transparent",
            border: `1px solid ${PALETTE.border}`,
            color: step <= 0 ? PALETTE.textMuted : PALETTE.textSecondary,
            fontFamily: FONTS.mono,
            fontSize: 10,
            padding: "6px 12px",
            borderRadius: 3,
            cursor: step <= 0 ? "default" : "pointer",
            opacity: step <= 0 ? 0.5 : 1,
          }}
        >
          ←
        </button>
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
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${PALETTE.border}`,
            color: PALETTE.textPrimary,
            fontFamily: FONTS.mono,
            fontSize: 10,
            padding: "6px 16px",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          {step >= maxStep ? "Reset" : playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={advance}
          disabled={step >= maxStep}
          style={{
            background: "transparent",
            border: `1px solid ${PALETTE.border}`,
            color: step >= maxStep ? PALETTE.textMuted : PALETTE.textSecondary,
            fontFamily: FONTS.mono,
            fontSize: 10,
            padding: "6px 12px",
            borderRadius: 3,
            cursor: step >= maxStep ? "default" : "pointer",
            opacity: step >= maxStep ? 0.5 : 1,
          }}
        >
          →
        </button>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: PALETTE.textMuted,
            marginLeft: 8,
          }}
        >
          {step + 1} / {maxStep + 1}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 8,
            color: PALETTE.textMuted,
            marginLeft: 8,
            opacity: 0.6,
          }}
        >
          V: toggle view · ← → navigate
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
