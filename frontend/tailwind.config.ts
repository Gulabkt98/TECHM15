import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem", xl: "2rem" }, screens: { "2xl": "1480px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        canvas: "hsl(var(--canvas))",
        foreground: "hsl(var(--foreground))",
        "foreground-strong": "hsl(var(--foreground-strong))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        "primary-strong": "hsl(var(--primary-strong))",
        "primary-soft": "hsl(var(--primary-soft))",
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
          subtle: "hsl(var(--surface-subtle))",
        },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        success: "hsl(var(--success))",
        info: "hsl(var(--info))",
        warning: "hsl(var(--warning))",
        risk: {
          critical: "hsl(var(--risk-critical))",
          high: "hsl(var(--risk-high))",
          medium: "hsl(var(--risk-medium))",
          low: "hsl(var(--risk-low))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius-sm)",
        sm: "var(--radius-xs)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "var(--shadow-card)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        popover: "var(--shadow-popover)",
        focus: "var(--shadow-focus)",
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in": { from: { opacity: "0", transform: "translateX(-8px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        "progress-flow": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease both",
        "fade-in": "fade-in 0.25s ease both",
        "slide-in": "slide-in 0.22s ease both",
        shimmer: "shimmer 2s linear infinite",
        "progress-flow": "progress-flow 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
