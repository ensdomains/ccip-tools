import react from '@vitejs/plugin-react';
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import { defineConfig } from 'vite';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react(), pluginRewriteAll()],
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
