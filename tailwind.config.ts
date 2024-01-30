import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",   // Default tailwindcss setting, including .md and .mdx
    `./docs/**/*.{js,jsx,ts,tsx,md,mdx}`,  // Add markdown content to the tailwindcss processor
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Hook into docusaurus dark mode settings
  corePlugins: { preflight: false },          // Disable preflight. It breaks docusaurus css defaults. https://tailwindcss.com/docs/preflight
  plugins: [],
  theme: {
    extend: {},
  },
} satisfies Config
