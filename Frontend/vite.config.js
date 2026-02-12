import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Usa polling para detectar cambios en sistemas de archivos problemáticos
    },
    hmr: {
      overlay: false, // Evita que la pantalla se congele si hay errores de HMR
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
