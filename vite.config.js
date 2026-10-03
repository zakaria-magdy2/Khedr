import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0) for local mobile access
    port: 5173
  }
});
