import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    // Gunakan base relatif untuk memastikan path aset benar di Vercel/Netlify
    base: './',
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
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'global': {},
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Optimasi Chunking untuk file > 500kb
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Memisahkan vendor library (seperti React, Lucide) ke file tersendiri
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    }
  };
});
