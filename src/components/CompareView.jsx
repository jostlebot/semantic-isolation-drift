import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";
import { Exchange } from "./Exchange";
import { AI_CONVERSATION, THERAPIST_CONVERSATION } from "../data/conversations";

export function CompareView({ step }) {
  const aiRef = useRef(null);
  const therapistRef = useRef(null);

  useEffect(() => {
    if (aiRef.current) {
      setTimeout(() => {
        aiRef.current.scrollTop = aiRef.current.scrollHeight;
      }, 50);
    }
    if (therapistRef.current) {
      setTimeout(() => {
        therapistRef.current.scrollTop = therapistRef.current.scrollHeight;
      }, 50);
    }
  }, [step]);

  const aiEntries = AI_CONVERSATION.slice(0, step + 1);
  const therapistEntries = THERAPIST_CONVERSATION.slice(0, step + 1);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        flex: 1,
        overflow: "hidden",
        background: PALETTE.border,
      }}
    >
      {/* AI Side */}
      <div
        style={{
          background: PALETTE.bg,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${PALETTE.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: PALETTE.accentCool,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: PALETTE.accentCool,
              textTransform: "uppercase",
            }}
          >
            AI Companion
          </span>
        </div>
        <div
          ref={aiRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {aiEntries.map((entry, i) => (
            <Exchange key={`ai-${i}`} entry={entry} mode="ai" index={i} />
          ))}
        </div>
      </div>

      {/* Therapist Side */}
      <div
        style={{
          background: PALETTE.bg,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${PALETTE.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: PALETTE.nodeTherapist,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: PALETTE.nodeTherapist,
              textTransform: "uppercase",
            }}
          >
            Human Therapist
          </span>
        </div>
        <div
          ref={therapistRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {therapistEntries.map((entry, i) => (
            <Exchange
              key={`therapist-${i}`}
              entry={entry}
              mode="therapist"
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
