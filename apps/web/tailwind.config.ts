import type { Config } from 'tailwindcss';
import sharedConfig from '@doku-seal/tailwind-config';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    // Include shared UI components
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
