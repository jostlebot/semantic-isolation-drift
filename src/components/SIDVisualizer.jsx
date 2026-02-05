import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";
import { AI_CONVERSATION, THERAPIST_CONVERSATION } from "../data/conversations";
import { Exchange } from "./Exchange";
import { ProgressBar } from "./ProgressBar";
import { CompareView } from "./CompareView";

function IntroScreen({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
          What happens inside people during conversation — and what happens when
          one side of the conversation has no inside at all?
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
          The same client. The same opening disclosure. Two relational contexts.
          Watch the biopsychosocial layers — body states, feeling, projection,
          clinical thinking, countertransference — unfold alongside each
          exchange.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onEnter}
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
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(212, 136, 106, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
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
            letterSpacing: "0.08em",
          }}
        >
          <div style={{ marginBottom: 8 }}>Skillman · ARI Framework</div>
          <a
            href="https://linktr.ee/jocelynskillmanLMHC"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: PALETTE.accent,
              textDecoration: "none",
              opacity: 0.7,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
          >
            linktr.ee/jocelynskillmanLMHC
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

function EndSummary({ mode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        marginTop: 24,
        padding: "20px",
        border: `1px solid ${
          mode === "ai" ? "rgba(196, 92, 92, 0.2)" : "rgba(122, 170, 138, 0.2)"
        }`,
        borderRadius: 8,
        background:
          mode === "ai"
            ? "rgba(196, 92, 92, 0.04)"
            : "rgba(122, 170, 138, 0.04)",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          letterSpacing: "0.15em",
          color: mode === "ai" ? PALETTE.warning : PALETTE.safe,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {mode === "ai" ? "The Drift" : "The Field"}
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 13.5,
          color: PALETTE.textSecondary,
          lineHeight: 1.65,
        }}
      >
        {mode === "ai"
          ? "One person was in the room. Their nervous system was fully engaged — projecting, attaching, regulating, grieving. The other side had no body, no feeling, no stake. Every validation landed in a closed loop: the user's own projections, mirrored back, steadily narrowing the world to a single point. The relational field didn't shrink because the AI was malicious. It shrank because there was only ever one person in it."
          : "Two people were in the room. Two nervous systems, co-regulating. Two histories, activated and held. The therapist felt the client's wound in her own body — and stayed. The client discovered, in real time, that connection and fear can coexist. Meaning wasn't delivered — it was made, together, in the space between two people who were both changed by the encounter. The witness was transformed by the witnessing."}
      </div>
    </motion.div>
  );
}

export default function SIDVisualizer() {
  const [mode, setMode] = useState("ai");
  const [viewMode, setViewMode] = useState("single"); // 'single' or 'compare'
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const chatRef = useRef(null);
  const intervalRef = useRef(null);

  const conversation =
    mode === "ai" ? AI_CONVERSATION : THERAPIST_CONVERSATION;
  const maxStep =
    viewMode === "compare"
      ? Math.min(AI_CONVERSATION.length, THERAPIST_CONVERSATION.length)
      : conversation.length;

  const advance = useCallback(() => {
    setStep((s) => {
      if (s >= maxStep - 1) {
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
          if (step < maxStep - 1) advance();
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
          if (step >= maxStep - 1) {
            setStep(0);
          }
          setPlaying((p) => !p);
          break;
        case "c":
        case "C":
          setViewMode((v) => (v === "single" ? "compare" : "single"));
          break;
        case "1":
          setMode("ai");
          setStep(0);
          break;
        case "2":
          setMode("therapist");
          setStep(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, step, maxStep, advance, goBack]);

  // Auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(advance, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, advance]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 50);
    }
  }, [step, mode]);

  const reset = () => {
    setStep(0);
    setPlaying(false);
  };

  const switchMode = (m) => {
    setMode(m);
    setStep(0);
    setPlaying(false);
  };

  if (showIntro) {
    return (
      <AnimatePresence>
        <IntroScreen onEnter={() => setShowIntro(false)} />
      </AnimatePresence>
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
          padding: "12px 16px",
          borderBottom: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              letterSpacing: "0.15em",
              color: PALETTE.textMuted,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            ARI Framework
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(16px, 4vw, 18px)",
              color: PALETTE.textPrimary,
            }}
          >
            Semantic Isolation{" "}
            <span style={{ color: PALETTE.accent }}>Drift</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
              { key: "single", label: "Single" },
              { key: "compare", label: "Compare" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                style={{
                  background:
                    viewMode === key ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  color:
                    viewMode === key ? PALETTE.textPrimary : PALETTE.textMuted,
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mode toggle (only in single view) */}
          {viewMode === "single" && (
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
                { key: "ai", label: "AI" },
                { key: "therapist", label: "Therapist" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  style={{
                    background:
                      mode === key ? "rgba(255,255,255,0.06)" : "transparent",
                    border: "none",
                    color:
                      mode === key ? PALETTE.textPrimary : PALETTE.textMuted,
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ paddingTop: 12 }}>
        <ProgressBar
          current={step}
          total={maxStep}
          onJump={setStep}
          mode={viewMode === "compare" ? "therapist" : mode}
        />
      </div>

      {/* Conversation area */}
      {viewMode === "compare" ? (
        <CompareView step={step} />
      ) : (
        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 16px",
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {conversation.slice(0, step + 1).map((entry, i) => (
            <Exchange key={`${mode}-${i}`} entry={entry} mode={mode} index={i} />
          ))}

          {step === maxStep - 1 && <EndSummary mode={mode} />}
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => {
            if (step >= maxStep - 1) reset();
            else setPlaying(!playing);
          }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${PALETTE.border}`,
            color: PALETTE.textPrimary,
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: "0.08em",
            padding: "8px 16px",
            borderRadius: 3,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = PALETTE.borderHover;
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = PALETTE.border;
          }}
        >
          {step >= maxStep - 1 ? "Reset (R)" : playing ? "Pause (P)" : "Play (P)"}
        </button>
        <button
          onClick={goBack}
          disabled={step <= 0}
          style={{
            background: "transparent",
            border: `1px solid ${PALETTE.border}`,
            color: step <= 0 ? PALETTE.textMuted : PALETTE.textSecondary,
            fontFamily: FONTS.mono,
            fontSize: 10,
            padding: "8px 12px",
            borderRadius: 3,
            cursor: step <= 0 ? "default" : "pointer",
            opacity: step <= 0 ? 0.5 : 1,
          }}
        >
          ←
        </button>
        <button
          onClick={advance}
          disabled={step >= maxStep - 1}
          style={{
            background: "transparent",
            border: `1px solid ${PALETTE.border}`,
            color:
              step >= maxStep - 1 ? PALETTE.textMuted : PALETTE.textSecondary,
            fontFamily: FONTS.mono,
            fontSize: 10,
            padding: "8px 12px",
            borderRadius: 3,
            cursor: step >= maxStep - 1 ? "default" : "pointer",
            opacity: step >= maxStep - 1 ? 0.5 : 1,
          }}
        >
          →
        </button>

        {/* Keyboard hints */}
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: PALETTE.textMuted,
            marginLeft: 8,
            display: "flex",
            gap: 12,
            opacity: 0.7,
          }}
        >
          <span>← → navigate</span>
          <span>C compare</span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${PALETTE.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: FONTS.mono,
          fontSize: 9,
          color: PALETTE.textMuted,
        }}
      >
        <span>Skillman · ARI Framework</span>
        <a
          href="https://linktr.ee/jocelynskillmanLMHC"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: PALETTE.accent,
            textDecoration: "none",
            opacity: 0.8,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
        >
          Linktree
        </a>
      </div>
    </div>
  );
}
