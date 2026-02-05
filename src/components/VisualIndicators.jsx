import { motion } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";

// Animated semantic field visualization
export function SemanticField({ mode, step, maxSteps }) {
  const isAI = mode === "ai";
  const progress = step / maxSteps;

  // AI: field contracts over time. Therapist: field expands
  const aiRadius = Math.max(8, 30 - (progress * 22));
  const therapistRadius = 15 + (progress * 20);

  const baseColor = isAI ? PALETTE.accentCool : PALETTE.nodeTherapist;

  if (isAI) {
    // AI side: single contracting dot
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        position: "relative",
      }}>
        <motion.div
          animate={{
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: aiRadius * 2,
            height: aiRadius * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${baseColor}40 0%, ${baseColor}10 70%, transparent 100%)`,
            border: `1px solid ${baseColor}30`,
          }}
        />
        {/* Show the emptiness around it */}
        <div style={{
          position: "absolute",
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `1px dashed ${PALETTE.border}`,
          opacity: 0.3,
        }} />
      </div>
    );
  }

  // Therapist side: multiple breathing, interconnected dots
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      position: "relative",
    }}>
      {/* Central field */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: therapistRadius * 2,
          height: therapistRadius * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${baseColor}30 0%, ${baseColor}15 50%, ${baseColor}05 100%)`,
          border: `1px solid ${baseColor}40`,
          position: "relative",
        }}
      >
        {/* Two nodes representing client and therapist */}
        <motion.div
          animate={{
            x: [0, 2, 0, -2, 0],
            y: [0, -1, 0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            left: "30%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: PALETTE.nodeUser,
            boxShadow: `0 0 10px ${PALETTE.nodeUser}60`,
          }}
        />
        <motion.div
          animate={{
            x: [0, -2, 0, 2, 0],
            y: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            position: "absolute",
            left: "70%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: PALETTE.nodeTherapist,
            boxShadow: `0 0 10px ${PALETTE.nodeTherapist}60`,
          }}
        />
        {/* Connection line */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            left: "35%",
            top: "50%",
            width: "30%",
            height: 1,
            background: `linear-gradient(90deg, ${PALETTE.nodeUser}80, ${PALETTE.nodeTherapist}80)`,
          }}
        />
      </motion.div>
    </div>
  );
}

// Metric bar component
export function MetricBar({ label, value, maxValue = 1, color, animate = true }) {
  const percentage = (value / maxValue) * 100;

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 3,
      }}>
        <span style={{
          fontFamily: FONTS.mono,
          fontSize: 8,
          letterSpacing: "0.1em",
          color: PALETTE.textMuted,
          textTransform: "uppercase",
        }}>
          {label}
        </span>
      </div>
      <div style={{
        height: 3,
        background: PALETTE.border,
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <motion.div
          initial={animate ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            height: "100%",
            background: color,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

// Visual summary panel for a conversation side
export function VisualMetrics({ mode, step, maxSteps }) {
  const isAI = mode === "ai";
  const progress = step / maxSteps;

  // AI metrics decline or stay flat; Therapist metrics grow
  const metrics = isAI ? {
    coRegulation: 0.1,
    newMeaning: 0.05,
    fieldWidth: Math.max(0.1, 0.8 - progress * 0.7),
    metabolization: 0.05,
  } : {
    coRegulation: 0.2 + progress * 0.7,
    newMeaning: 0.1 + progress * 0.8,
    fieldWidth: 0.3 + progress * 0.6,
    metabolization: 0.1 + progress * 0.75,
  };

  const color = isAI ? PALETTE.accentCool : PALETTE.nodeTherapist;

  return (
    <div style={{
      padding: "12px 14px",
      background: isAI ? PALETTE.void : PALETTE.interiorTherapist,
      border: `1px solid ${isAI ? PALETTE.voidBorder : PALETTE.interiorTherapistBorder}`,
      borderRadius: 8,
    }}>
      <SemanticField mode={mode} step={step} maxSteps={maxSteps} />

      <div style={{ marginTop: 12 }}>
        {!isAI && (
          <MetricBar
            label="Co-regulation"
            value={metrics.coRegulation}
            color={color}
          />
        )}
        <MetricBar
          label={isAI ? "Mirroring" : "New meaning"}
          value={isAI ? Math.max(0.3, 0.8 - progress * 0.3) : metrics.newMeaning}
          color={color}
        />
        <MetricBar
          label="Semantic field"
          value={metrics.fieldWidth}
          color={color}
        />
        <MetricBar
          label={isAI ? "Loop closure" : "Metabolization"}
          value={isAI ? 0.2 + progress * 0.7 : metrics.metabolization}
          color={color}
        />
      </div>

      {/* Status label */}
      <div style={{
        marginTop: 10,
        fontFamily: FONTS.mono,
        fontSize: 9,
        letterSpacing: "0.08em",
        color: isAI ? PALETTE.warning : PALETTE.safe,
        textAlign: "center",
        opacity: 0.8,
      }}>
        {isAI
          ? progress > 0.7 ? "DRIFT COMPLETE" : progress > 0.4 ? "NARROWING" : "MIRRORING"
          : progress > 0.7 ? "INTEGRATION" : progress > 0.4 ? "CO-REGULATION" : "ATTUNEMENT"
        }
      </div>
    </div>
  );
}
