import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// Build del wrapper React: ESM independiente, react queda como peer dependency.
export default defineConfig({
    plugins: [
        preact(),
        dts({
            outDir: 'dist/types/react',
            include: ['src/react/index.tsx'],
            // Los tipos del core se copian con el build principal
            exclude: ['src/react/demo.tsx']
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: true,
        lib: {
            entry: resolve(__dirname, 'src/react/index.tsx'),
            formats: ['es'],
            fileName: () => 'ecoflow-bubble-react.mjs'
        },
        rollupOptions: {
            external: ['react']
        }
    }
})
