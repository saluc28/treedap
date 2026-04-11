import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Converts the extracted CSS bundle from render-blocking to async.
 * Safe because all above-the-fold styles are already inlined in index.html.
 * The noscript fallback ensures CSS still loads in no-JS environments.
 */
const asyncCssPlugin: Plugin = {
  name: 'async-css',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*)>/g,
        (_, attrs) =>
          `<link rel="preload" as="style"${attrs} onload="this.onload=null;this.rel='stylesheet'">` +
          `\n    <noscript><link rel="stylesheet"${attrs}></noscript>`
      );
    },
  },
};

export default defineConfig({
  plugins: [react(), asyncCssPlugin],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat/client',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // React runtime in its own chunk — separately cacheable, never changes
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
