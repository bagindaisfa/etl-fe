import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890ff', // Change primary color
        },
        javascriptEnabled: true,
      },
    },
  },
});
