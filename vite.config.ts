import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // FIX: Replace process.cwd() with __dirname to resolve TypeScript error.
  // In this context, __dirname refers to the project root, which is the correct path for loadEnv.
  const env = loadEnv(mode, __dirname, '');
  return {
    // Memastikan path resolusi tepat untuk alias @
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    plugins: [react()],
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    // Perbaikan Error #31: Pastikan env terdefinisi sebagai string murni
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'global': {},
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});