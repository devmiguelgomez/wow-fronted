import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg'],
  resolve: {
    alias: {
      'styled-components': 'styled-components',
      'axios': 'axios',
      'uuid': 'uuid'
    }
  },
  build: {
    rollupOptions: {
      external: ['styled-components', 'axios', 'uuid'],
      output: {
        globals: {
          'styled-components': 'styled',
          'axios': 'axios',
          'uuid': 'uuid'
        }
      }
    }
  }
})
