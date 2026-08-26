import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_NAME = '1817-family';
const stylesPath = path.resolve(__dirname, 'src/styles');

export default defineConfig({
  base: process.env.GITHUB_PAGES ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [stylesPath],
        additionalData(source, filePath) {
          if (filePath.endsWith('_variables.scss') || filePath.endsWith('_mixins.scss')) {
            return source;
          }
          return `@use "variables" as *;\n@use "mixins" as *;\n${source}`;
        },
      },
    },
  },
});
