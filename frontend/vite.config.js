import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), '..'), '')

  return {
    plugins: [react()],
    server: { proxy: { "/api": `http://localhost:${env.PORT}`,},},
  }
}
)
