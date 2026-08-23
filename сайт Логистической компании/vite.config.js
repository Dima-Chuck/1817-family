import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️ GitHub Pages: замените 1817-family на ТОЧНОЕ название вашего репозитория на GitHub
// Пример: репозиторий github.com/dima/semja → base: '/semja/'
const REPO_NAME = '1817-family';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/styles/variables" as *; @use "src/styles/mixins" as *;`,
      },
    },
  },
});
