import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Marketing page colors - New brand color system
        brand: {
          primary: '#FF5656', // Main highlight color (red)
          DEFAULT: '#FF5656',
        },
        neon: {
          cyan: '#00f5ff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          green: '#39ff14',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        // Original animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'gradient': 'gradient 8s linear infinite',
        // Enhanced animations
        'float-up': 'floatUp 3s infinite ease-in-out',
        'float-down': 'floatDown 3s infinite ease-in-out',
        'float-left': 'floatLeft 3s infinite ease-in-out',
        'float-right': 'floatRight 3s infinite ease-in-out',
        'spin-slow': 'spin 7s infinite ease-in-out',
        'spin-slower': 'spin 10s infinite linear',
        'blink': 'blink 2.5s linear infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'ripple': 'ripple 2s infinite',
        'text-glow': 'textGlow 0.8s both',
        'cloud-move': 'cloudMove 28s linear infinite',
        'bounce-slow': 'bounceSlow 3s infinite ease-in-out',
      },
      keyframes: {
        // Original keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Enhanced keyframes
        floatUp: {
          '0%, 100%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        floatDown: {
          '0%, 100%': { transform: 'translateY(8px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatLeft: {
          '0%, 100%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(10px)' },
        },
        floatRight: {
          '0%, 100%': { transform: 'translateX(5px)' },
          '50%': { transform: 'translateX(-10px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.3)',
          },
        },
        ripple: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(147, 51, 234, 0.4), 0 0 0 10px rgba(147, 51, 234, 0.3), 0 0 0 20px rgba(147, 51, 234, 0.2)',
          },
          '100%': {
            boxShadow: '0 0 0 10px rgba(147, 51, 234, 0.3), 0 0 0 20px rgba(147, 51, 234, 0.2), 0 0 0 40px rgba(147, 51, 234, 0)',
          },
        },
        textGlow: {
          '0%': { opacity: '0' },
          '65%': {
            opacity: '1',
            textShadow: '0 0 25px rgb(147 51 234 / 0.8)',
          },
          '100%': { opacity: '1' },
        },
        cloudMove: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        bounceSlow: {
          '0%, 100%': {
            transform: 'translateY(-5%) scale(1)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0) scale(1.05)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}

export default config

