Requirements: Assumes Next.js app set up without Tailwind.

Set up Tailwind CSS v4 in my existing Next.js app.

Steps:
1. Install: `pnpm add tailwindcss @tailwindcss/postcss`
2. Create postcss.config.js: `module.exports = { plugins: { "@tailwindcss/postcss": {} } }`
3. Replace globals.css content with: `@import "tailwindcss";`
4. Start dev server: `pnpm dev`

CRITICAL: Use CommonJS format (module.exports) for PostCSS config, not ES modules.
