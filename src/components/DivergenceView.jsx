import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";
import { AI_CONVERSATION, THERAPIST_CONVERSATION } from "../data/conversations";
import { VisualMetrics } from "./VisualIndicators";
import { InteriorPanel, AIVoid } from "./InteriorPanel";

// Pair up the conversations by client message
function getPairedExchanges() {
  const pairs = [];
  const maxLen = Math.max(AI_CONVERSATION.length, THERAPIST_CONVERSATION.length);

  for (let i = 0; i < maxLen; i += 2) {
    const clientMsg = AI_CONVERSATION[i]; // Client message (same in both)
    const aiResponse = AI_CONVERSATION[i + 1];
    const therapistResponse = THERAPIST_CONVERSATION[i + 1];

    pairs.push({
      client: clientMsg,
      ai: aiResponse,
      therapist: therapistResponse,
      therapistClientInterior: THERAPIST_CONVERSATION[i]?.userInterior,
      therapistInteriorOnClient: THERAPIST_CONVERSATION[i]?.therapistInterior,
    });
  }

  return pairs;
}

const PAIRED_EXCHANGES = getPairedExchanges();

function MessageBubble({ text, speaker, side }) {
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
        marginBottom: 8,
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
          maxWidth: "95%",
          padding: "8px 12px",
          borderRadius: isClient
            ? "12px 12px 4px 12px"
            : "12px 12px 12px 4px",
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

function ConversationColumn({ side, exchanges, step, viewMode, expandedPanels, onTogglePanel }) {
  const isAI = side === "ai";
  const columnRef = useRef(null);

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
          {isAI ? "AI Companion" : "Human Therapist"}
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
        {exchanges.slice(0, step + 1).map((exchange, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {/* Response */}
            {isAI && exchange.ai && (
              <>
                <MessageBubble
                  text={exchange.ai.text}
                  speaker="ai"
                  side={side}
                />
                {viewMode === "detailed" && exchange.ai.aiProcess && (
                  <AIVoid
                    process={exchange.ai.aiProcess}
                    isExpanded={expandedPanels[`ai-${i}`] !== false}
                    onToggle={() => onTogglePanel(`ai-${i}`)}
                  />
                )}
                {viewMode === "detailed" && exchange.ai.userInterior && (
                  <InteriorPanel
                    interior={exchange.ai.userInterior}
                    role="user"
                    isExpanded={expandedPanels[`ai-user-${i}`] !== false}
                    onToggle={() => onTogglePanel(`ai-user-${i}`)}
                  />
                )}
              </>
            )}

            {!isAI && exchange.therapist && (
              <>
                <MessageBubble
                  text={exchange.therapist.text}
                  speaker="therapist"
                  side={side}
                />
                {viewMode === "detailed" && exchange.therapist.therapistInterior && (
                  <InteriorPanel
                    interior={exchange.therapist.therapistInterior}
                    role="therapist"
                    isExpanded={expandedPanels[`therapist-${i}`] !== false}
                    onToggle={() => onTogglePanel(`therapist-${i}`)}
                  />
                )}
                {viewMode === "detailed" && exchange.therapist.userInterior && (
                  <InteriorPanel
                    interior={exchange.therapist.userInterior}
                    role="user"
                    isExpanded={expandedPanels[`therapist-user-${i}`] !== false}
                    onToggle={() => onTogglePanel(`therapist-user-${i}`)}
                  />
                )}
              </>
            )}
          </div>
        ))}

        {/* Visual metrics in visual mode */}
        {viewMode === "visual" && (
          <div style={{ marginTop: 8 }}>
            <VisualMetrics
              mode={side}
              step={step}
              maxSteps={exchanges.length - 1}
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
  const [viewMode, setViewMode] = useState("visual"); // 'visual' or 'detailed'
  const [showIntro, setShowIntro] = useState(true);
  const [expandedPanels, setExpandedPanels] = useState({});
  const intervalRef = useRef(null);

  const maxStep = PAIRED_EXCHANGES.length - 1;

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
      intervalRef.current = setInterval(advance, 6000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, advance]);

  const currentExchange = PAIRED_EXCHANGES[step];

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
            The same client. The same opening words. Two different relational contexts.
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

      {/* Shared client message - THE ORIGIN POINT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${PALETTE.border}`,
            background: "rgba(232, 193, 112, 0.03)",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              letterSpacing: "0.15em",
              color: PALETTE.nodeUser,
              textTransform: "uppercase",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Client says:
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 15,
              lineHeight: 1.5,
              color: PALETTE.textPrimary,
              textAlign: "center",
              maxWidth: 600,
              margin: "0 auto",
              padding: "12px 20px",
              background: "rgba(232, 193, 112, 0.06)",
              border: `1px solid rgba(232, 193, 112, 0.15)`,
              borderRadius: 8,
            }}
          >
            "{currentExchange?.client?.text}"
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <svg width="40" height="24" viewBox="0 0 40 24">
              <path
                d="M20 0 L20 8 L8 8 L8 24 M20 8 L32 8 L32 24"
                fill="none"
                stroke={PALETTE.border}
                strokeWidth="1"
              />
              <circle cx="8" cy="24" r="3" fill={PALETTE.accentCool} opacity="0.5" />
              <circle cx="32" cy="24" r="3" fill={PALETTE.nodeTherapist} opacity="0.5" />
            </svg>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Split view - AI left, Therapist right */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <ConversationColumn
          side="ai"
          exchanges={PAIRED_EXCHANGES}
          step={step}
          viewMode={viewMode}
          expandedPanels={expandedPanels}
          onTogglePanel={togglePanel}
        />
        <ConversationColumn
          side="therapist"
          exchanges={PAIRED_EXCHANGES}
          step={step}
          viewMode={viewMode}
          expandedPanels={expandedPanels}
          onTogglePanel={togglePanel}
        />
      </div>

      {/* Progress bar */}
      <div style={{ padding: "8px 16px", borderTop: `1px solid ${PALETTE.border}` }}>
        <div style={{ display: "flex", gap: 3 }}>
          {PAIRED_EXCHANGES.map((_, i) => (
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
          V: toggle view
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
