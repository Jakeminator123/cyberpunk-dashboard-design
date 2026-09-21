import type { Config } from 'tailwindcss'

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Scout Gaming brand tokens (scoutgaminggroup.com :root)
        scout: {
          ink: '#0A0B0D',
          off: '#F2F1ED',
          paper: '#FAFAF7',
          lime: { DEFAULT: '#D6FF3A', deep: '#B5DC1F' },
          steel: { DEFAULT: '#5A6470', deep: '#1F252E' },
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'reveal-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-3d': {
          from: { opacity: '0', transform: 'perspective(1400px) rotateX(14deg) translateY(40px) scale(0.96)' },
          to: { opacity: '1', transform: 'perspective(1400px) rotateX(0) translateY(0) scale(1)' },
        },
        // Rests upright ~70% of the cycle, then does one full flip so the mark never reads as a backslash for long
        'slash-swing': {
          '0%, 70%': { transform: 'rotateY(0deg) translateZ(0)' },
          '85%': { transform: 'rotateY(180deg) translateZ(28px)' },
          '100%': { transform: 'rotateY(360deg) translateZ(0)' },
        },
        'scan': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
        'grid-drift': {
          from: { backgroundPosition: '0 0, 0 0' },
          to: { backgroundPosition: '48px 48px, 48px 48px' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'reveal-up': 'reveal-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'reveal-3d': 'reveal-3d 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slash-swing': 'slash-swing 6s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'scan': 'scan 7s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'grid-drift': 'grid-drift 18s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
