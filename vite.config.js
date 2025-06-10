import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cors from 'cors'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    cors: {
      origin: ['http://localhost:4000', 'http://139.59.250.140:4000'], // Add your frontend URLs
      credentials: true
    }
  },
})
