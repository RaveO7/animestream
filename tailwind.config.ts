import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Optimisation pour réduire la taille du CSS généré
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'infoVideo': '#767676',
        'midnight': '#14181d',
        'timeVideo': '#c6c6c6',
        'bgTimeVideo': '#1b1b1b',
        'bgBody': '#14181d',
        'dessous': '#969696',
        'bermuda': '#78dcca',
      },
      screens: {
        'hd': '1150px',
        'minsm': '480px',
        'mm': '424px',
        'ms': '374px',
      }
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
export default config