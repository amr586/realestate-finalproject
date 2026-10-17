import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The Express wrapper does not forward WebSocket upgrades, so Vite HMR
      // would repeatedly attempt a connection that cannot be opened.
      hmr: false,
      watch: null,
    },
  };
});
