import { motion, AnimatePresence } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";

export function InteriorPanel({ interior, role, isExpanded, onToggle }) {
  if (role === "ai" && !interior) return null;

  const isUser = role === "user";
  const isTherapist = role === "therapist";

  const bgColor = isUser
    ? PALETTE.interiorUser
    : isTherapist
    ? PALETTE.interiorTherapist
    : PALETTE.interiorAI;
  const borderColor = isUser
    ? PALETTE.interiorUserBorder
    : isTherapist
    ? PALETTE.interiorTherapistBorder
    : PALETTE.interiorAIBorder;
  const labelColor = isUser
    ? PALETTE.nodeUser
    : isTherapist
    ? PALETTE.nodeTherapist
    : PALETTE.accentCool;

  const labelText = isUser
    ? "Client Interior"
    : isTherapist
    ? "Therapist Interior"
    : "AI Interior";

  const fields = isUser
    ? [
        { label: "Body", text: interior.body },
        { label: "Feeling", text: interior.feeling },
        { label: "Projection", text: interior.projection },
        { label: "Need", text: interior.need },
      ]
    : isTherapist
    ? [
        { label: "Body", text: interior.body },
        { label: "Feeling", text: interior.feeling },
        { label: "Clinical Thinking", text: interior.clinicalThinking },
        { label: "Countertransference", text: interior.countertransference },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 4,
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: "0.12em",
            color: labelColor,
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          {labelText}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: labelColor,
            opacity: 0.6,
            fontSize: 12,
          }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 14px 12px" }}>
              {fields.map(({ label, text }) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 9,
                      color: PALETTE.textMuted,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                  <div
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: 12.5,
                      lineHeight: 1.55,
                      color: PALETTE.textSecondary,
                      marginTop: 2,
                    }}
                  >
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AIVoid({ process, isExpanded, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: PALETTE.void,
        border: `1px solid ${PALETTE.voidBorder}`,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 4,
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: "0.12em",
            color: PALETTE.accentCool,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          AI Interior
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: PALETTE.accentCool,
            opacity: 0.6,
            fontSize: 12,
          }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 14px 12px" }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11.5,
                  lineHeight: 1.55,
                  color: "rgba(126, 184, 212, 0.6)",
                  fontStyle: "italic",
                }}
              >
                {process}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
