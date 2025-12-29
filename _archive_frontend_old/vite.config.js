import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend Node
        changeOrigin: true,
        secure: false,
      },
      // Se precisarmos chamar o Python diretamente em dev, podemos adicionar:
      // '/python-api': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      // }
    }
  }
})
