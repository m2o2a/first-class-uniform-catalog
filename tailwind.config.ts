import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",       // near-black, hero / dark sections
        paper: "#F7F6F2",     // warm off-white section background
        royal: "#16308C",     // primary brand blue (from logo)
        signal: "#D62828",    // brand red (from logo)
        steel: "#5B6472",     // muted body text on light bg
        line: "#E4E2DC",      // hairline / stitch dividers
        mist: "#AEB4C2"       // muted text on dark bg
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      backgroundImage: {
        "fabric-grid":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)"
      },
      backgroundSize: {
        weave: "24px 24px"
      },
      letterSpacing: {
        widest2: "0.25em"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        marqueeRtl: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" }
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        marqueeRtl: "marqueeRtl 38s linear infinite",
        reveal: "reveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards"
      }
    }
  },
  plugins: []
};

export default config;
