import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// Build principal: un único entry que emite dos artefactos del mismo fuente.
// - dist/ecoflow-bubble.mjs (ESM): import en React/Vite/webpack
// - dist/ecoflow-bubble.js  (IIFE): <script src> en HTML plano, todo inline
export default defineConfig({
    plugins: [
        preact(),
        dts({
            insertTypesEntry: true,
            outDir: 'dist/types',
            // El wrapper de React tiene su propio build; aquí solo el core
            include: ['src/index.ts', 'src/types.ts', 'src/element.ts', 'src/config/**'],
            exclude: ['src/react/**']
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'EcoflowChat',
            formats: ['es', 'iife'],
            fileName: (format) => (format === 'es' ? 'ecoflow-bubble.mjs' : 'ecoflow-bubble.js')
        }
    }
})
