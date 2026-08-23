import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_NAME = '1817-family';

const sassVar = path.resolve(__dirname, 'src/styles/variables').replace(/\\/g, '/');
const sassMix = path.resolve(__dirname, 'src/styles/mixins').replace(/\\/g, '/');

export default defineConfig({
  base: process.env.GITHUB_PAGES ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData(source, filePath) {
          if (filePath?.includes('_variables.scss') || filePath?.includes('_mixins.scss')) {
            return source;
          }
          return `@use "${sassVar}" as *; @use "${sassMix}" as *;\n${source}`;
        },
      },
    },
  },
});
