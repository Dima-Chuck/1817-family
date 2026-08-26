import path from 'node:path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_NAME = '1817-family';
const stylesPath = path.resolve(__dirname, 'src/styles').replace(/\\/g, '/');

export default defineConfig({
  base: process.env.GITHUB_PAGES ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData(source, filePath) {
          if (filePath.endsWith('_variables.scss') || filePath.endsWith('_mixins.scss')) {
            return source;
          }
          return `@use "${stylesPath}/variables" as *;\n@use "${stylesPath}/mixins" as *;\n${source}`;
        },
      },
    },
  },
});
