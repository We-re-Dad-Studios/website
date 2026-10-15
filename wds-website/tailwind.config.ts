import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./styles/**/*.{css,scss}", // Include styles folder if used
	  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			neutral_whtie: '#fafafa',
  			neutral_100: '#120E11',
  			neutral_200: '#cccbcb',
  			neutral_300: '#b5b3b3',
  			neutral_400: '#9f9c9c',
  			neutral_500: '#898384',
  			neutral_600: '#726c6c',
  			neutral_700: '#5a5555',
  			neutral_800: '#433e3f',
  			neutral_900: '#2b2829',
  			neutral_1000: '#151314',
  			base_black: '#0a0a0b',
  			primary: {
  				// Mystical Indigo — fills (bg, gradients). Text/border/ring uses
  				// below swap to a lighter indigo in dark mode for contrast.
  				'0': 'rgb(var(--wds-primary) / <alpha-value>)',
  				'100': '#E9E8FB',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			// Brand Guidelines palette (fixed, theme-independent)
  			brand: {
  				indigo: '#3732CC',
  				'indigo-deep': '#2621A8',
  				pink: '#F659DA',
  				green: '#34F58C',
  				ink: '#0F0D33',
  				mist: '#DCDBF7',
  				lilac: '#EFEEFD',
  				muted: '#4A4790',
  				rule: '#D9D8F5'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			wds: {
  			  'nav-bg': 'hsl(var(--wds-nav-bg))',
  			  'nav-border': 'hsl(var(--wds-nav-border))',
  			  surface: 'hsl(var(--wds-surface))',
  			  'text-primary': 'hsl(var(--wds-text-primary))',
  			  'text-secondary': 'hsl(var(--wds-text-secondary))',
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		textColor: {
  			primary: { '0': 'rgb(var(--wds-primary-accent) / <alpha-value>)' }
  		},
  		borderColor: {
  			primary: { '0': 'rgb(var(--wds-primary-accent) / <alpha-value>)' }
  		},
  		ringColor: {
  			primary: { '0': 'rgb(var(--wds-primary-accent) / <alpha-value>)' }
  		},
  		fontFamily: {
			bebas: ['var(--font-bebas)', 'sans-serif'],
			agdasima: ['var(--font-agdasima)', 'sans-serif'],
			// Plaguard: headers, hooks, capital-letter moments. Always uppercase.
			plaguard: ['var(--font-plaguard)', 'var(--font-agdasima)', 'sans-serif']
		  },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
