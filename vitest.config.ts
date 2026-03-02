import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        css: false,
        deps: {
            optimizer: {
                web: {
                    include: ['@csstools/*', '@asamuzakjp/*'],
                },
            },
        },
    },
})
