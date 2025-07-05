import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// helper to load cert if exists
const certPath = path.resolve(__dirname, 'cert');
let httpsOptions: any = false;
try {
  const key = fs.readFileSync(path.join(certPath, 'server-key.pem'));
  const cert = fs.readFileSync(path.join(certPath, 'server-cert.pem'));
  httpsOptions = { key, cert };
} catch {}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    https: httpsOptions,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true, },
    },
  },
}); 