import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

dotenv.config()

export default defineConfig({
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@client': path.resolve(__dirname, './src'),
            '@server': path.resolve(__dirname, '../server/src'),
            '@shared': path.resolve(__dirname, '../shared/src'),
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: process.env.VITE_SERVER_URL || 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
})
