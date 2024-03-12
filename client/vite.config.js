import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      // if req contains '/api/...,it will be added with target
      '/api':{
        target:'http://localhost:8000',
        secure:false,
        
      },
    },
  },
  plugins: [react()],
})
