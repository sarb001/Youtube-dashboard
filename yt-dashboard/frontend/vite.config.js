import { defineConfig , loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(),'');
  const isProd = mode === 'production';

  return {
  plugins: [react()],
  server : {
    proxy : {
      '/api/v1' : {
         target : isProd ? env.VITE_API_BASE_URL : 'http://localhost:3000',
         changeOrigin : true,
         secure : false,
      }
    }
  }
}
})

