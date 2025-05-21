# Vite React Setup with TypeScript

## Overview
Create a fresh Vite React application with TypeScript configuration, essential dependencies, and proper project structure for a professional website.

## Requirements

### Technical Setup
- Initialize a new Vite React project with TypeScript
- Install and configure ESLint and Prettier for code quality
- Set up initial directory structure following best practices
- Configure essential dependencies:
  - React Router for navigation
  - Tailwind CSS for styling
  - Essential type definitions
### Implementation Steps

#### 1. Initialize the Vite project
```bash
npm create vite@latest my-website -- --template react-ts
cd my-website
```

#### 2. Install core dependencies
```bash
# React Router for navigation
npm install react-router-dom

# Development dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-prettier eslint-config-prettier
npm install -D vite-tsconfig-paths
```

#### 3. Configure Tailwind CSS
```bash
npx tailwindcss init -p
```

Update the tailwind.config.js file:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update src/index.css with Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
  
  body {
    @apply bg-white text-gray-900 min-h-screen;
  }
}
```
#### 4. Configure ESLint and Prettier

Create .eslintrc.cjs:
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh', 'react', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

Create .prettierrc:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```
#### 5. Update TypeScript Configuration

Edit tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@pages/*": ["src/pages/*"],
      "@assets/*": ["src/assets/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@styles/*": ["src/styles/*"]
    },

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```
#### 6. Update vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Additional build options as needed
  },
});
```

#### 7. Create Project Directory Structure

```bash
mkdir -p src/{assets,components/ui,layouts,pages,hooks,utils,types,styles}
```

#### 8. Create Basic Components and Pages

Create src/layouts/RootLayout.tsx:
```tsx
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">My Website</h1>
          {/* Navigation will go here */}
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} My Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
```
Create src/pages/HomePage.tsx:
```tsx
export function HomePage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to My Website</h1>
      <p className="text-gray-600 mb-4">
        This is a starter template for your new website built with Vite, React, TypeScript, and Tailwind CSS.
      </p>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
        <p>Edit the files in the src directory to start building your website.</p>
      </div>
    </div>
  );
}
```

Create src/pages/AboutPage.tsx:
```tsx
export function AboutPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-gray-600 mb-4">
        This is the about page of your new website.
      </p>
    </div>
  );
}
```

#### 9. Set up Router Configuration

Update src/App.tsx:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '@layouts/RootLayout';
import { HomePage } from '@pages/HomePage';
import { AboutPage } from '@pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
#### 10. Update package.json Scripts

Add to package.json:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"",
  "type-check": "tsc --noEmit"
}
```

### Expected Output

A fully functional Vite + React + TypeScript project with:

- Clean directory structure
- TypeScript properly configured with path aliases
- ESLint and Prettier working together
- Tailwind CSS ready for use
- Working router setup with layouts
- Basic pages implemented
- Core development scripts

### Final Directory Structure

```
my-website/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   ├── layouts/
│   │   └── RootLayout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── AboutPage.tsx
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Next Steps

After completing this setup:

1. Implement the global header component with navigation
2. Create a color system and typography definitions
3. Build reusable UI components
4. Expand the page collection

## Notes

- This setup uses Tailwind CSS for styling, but can be adapted to use CSS Modules, Styled Components, or other styling approaches
- Path aliases are configured to make imports cleaner (e.g., `@components/Button` instead of `../../components/Button`)
- The RootLayout component provides a consistent structure for all pages