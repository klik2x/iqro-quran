import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
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
    define: {
      // FIX: Ensure API_KEY is used correctly from .env.local
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'global': {},
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});
