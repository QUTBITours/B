import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/B/', // <-- update this to your repo name!
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});