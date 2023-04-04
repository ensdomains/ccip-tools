import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), pluginRewriteAll()],
    define: {
        // global: 'globalThis',
    },

    resolve: {
        alias: {
            process: 'process/browser',
            util: 'util',
        },
    },
});
