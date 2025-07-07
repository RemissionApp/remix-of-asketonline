import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cosmic: {
					DEFAULT: 'hsl(var(--cosmic-dark))',
					'foreground': 'hsl(var(--foreground))',
					'accent': 'hsl(var(--cosmic-accent))',
					'accent2': 'hsl(var(--cosmic-accent2))',
					'gold': 'hsl(var(--cosmic-gold))',
					'dark': 'hsl(var(--cosmic-dark))',
					'star': 'hsl(var(--foreground))',
					'secondary': 'hsl(var(--cosmic-secondary))',
					'indigo': 'hsl(var(--cosmic-indigo))',
					'deep-blue': 'hsl(var(--cosmic-deep-blue))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'serif': ['Cinzel', 'serif'],
				'sans': ['Inter', 'sans-serif'],
				'cormorant': ['Cormorant', 'serif'],
			},
			backgroundImage: {
				'cosmic-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'star-shine': {
					'0%': { opacity: '0.1', transform: 'scale(0.8)' },
					'50%': { opacity: '1', transform: 'scale(1.2)' },
					'100%': { opacity: '0.1', transform: 'scale(0.8)' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'circle-expand': {
					'0%': { transform: 'scale(0.8)', opacity: '0.5' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'particles-gather': {
					'0%': { transform: 'translateY(20px) translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3)' 
					},
					'50%': { 
						boxShadow: '0 0 15px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.5)' 
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'spin-slow': 'spin-slow 20s linear infinite',
				'star-shine': 'star-shine 4s infinite ease-in-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'circle-expand': 'circle-expand 1s ease-out forwards',
				'particles-gather': 'particles-gather 1.5s ease-out forwards',
				'glow-pulse': 'glow-pulse 3s infinite ease-in-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
