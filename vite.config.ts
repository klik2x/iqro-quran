import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Gunakan './' agar semua aset menggunakan path relatif
  base: './', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Memastikan build tidak berhenti jika ada warning kecil
    chunkSizeWarningLimit: 1600, 
    rollupOptions: {
      // Pastikan entry point mengarah ke index.html di root
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});
