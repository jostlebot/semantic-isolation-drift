import { useState } from "react";
import { motion } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";
import { InteriorPanel, AIVoid } from "./InteriorPanel";

export function Exchange({ entry, mode, index }) {
  const [expandedPanels, setExpandedPanels] = useState({
    user: true,
    responder: true,
  });

  const isUser = entry.speaker === "user";

  const togglePanel = (panel) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      style={{ marginBottom: 20 }}
    >
      {/* The spoken text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontFamily: FONTS.mono,
            color: PALETTE.textMuted,
            marginBottom: 4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {entry.speaker === "user"
            ? "client"
            : entry.speaker === "ai"
            ? "AI companion"
            : "therapist"}
        </div>
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            maxWidth: "90%",
            padding: "10px 14px",
            borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            background: isUser
              ? "rgba(232, 193, 112, 0.08)"
              : entry.speaker === "ai"
              ? "rgba(126, 184, 212, 0.06)"
              : "rgba(196, 160, 122, 0.06)",
            border: `1px solid ${
              isUser
                ? "rgba(232, 193, 112, 0.15)"
                : entry.speaker === "ai"
                ? "rgba(126, 184, 212, 0.12)"
                : "rgba(196, 160, 122, 0.12)"
            }`,
            fontFamily: FONTS.body,
            fontSize: 14,
            lineHeight: 1.55,
            color: PALETTE.textPrimary,
          }}
        >
          {entry.text}
        </motion.div>
      </div>

      {/* Interior panels */}
      <div style={{ marginTop: 8 }}>
        {entry.userInterior && (
          <InteriorPanel
            interior={entry.userInterior}
            role="user"
            isExpanded={expandedPanels.user}
            onToggle={() => togglePanel("user")}
          />
        )}

        {mode === "ai" && entry.aiProcess && (
          <AIVoid
            process={entry.aiProcess}
            isExpanded={expandedPanels.responder}
            onToggle={() => togglePanel("responder")}
          />
        )}

        {mode === "therapist" && entry.therapistInterior && (
          <InteriorPanel
            interior={entry.therapistInterior}
            role="therapist"
            isExpanded={expandedPanels.responder}
            onToggle={() => togglePanel("responder")}
          />
        )}
      </div>
    </motion.div>
  );
}
