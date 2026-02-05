import { motion } from "framer-motion";
import { PALETTE, FONTS } from "../styles/theme";

export function ProgressBar({ current, total, onJump, mode }) {
  const progressColor = mode === "ai" ? PALETTE.accentCool : PALETTE.nodeTherapist;

  return (
    <div style={{ padding: "0 20px", marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onJump(i)}
            style={{
              flex: 1,
              height: 4,
              background:
                i <= current
                  ? progressColor
                  : PALETTE.border,
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: i <= current ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scaleY(1.5)";
              e.target.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scaleY(1)";
              e.target.style.opacity = i <= current ? "1" : "0.5";
            }}
            title={`Exchange ${i + 1}`}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontFamily: FONTS.mono,
          fontSize: 9,
          color: PALETTE.textMuted,
          letterSpacing: "0.05em",
        }}
      >
        <span>Exchange {current + 1} of {total}</span>
        <span style={{ opacity: 0.6 }}>Click bar to jump</span>
      </div>
    </div>
  );
}
