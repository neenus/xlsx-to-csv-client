import { build, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  mode: build ? 'production' : 'development',
  plugins: [react()],
  server: {
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    open: true,
    port: 3000, // you can replace this port with any port
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react'],
          reactDom: ['react-dom'],
          reactRouter: ['react-router'],
          reactRouterDom: ['react-router-dom'],
          reactToastify: ['react-toastify'],
          muiCore: ['@mui/material'],
          muiIcons: ['@mui/icons-material'],
          muiLab: ['@mui/lab'],
        },
      },
    },
  },
});
