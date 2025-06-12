// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    ssr: true,
    
    // Dev Server Configuration
    devServer: {
        port: 3001
    },
    
    // Runtime Config
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://localhost:7000/api/v1',
            apiTimeout: process.env.NUXT_PUBLIC_API_TIMEOUT || 30000,
            tokenCookieName: process.env.NUXT_PUBLIC_TOKEN_COOKIE_NAME || 'auth-token',
            refreshTokenCookieName: process.env.NUXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || 'refresh-token',
        }
    },
    
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'BetStarter - Bahis ve Spor Platformu',
            meta: [
                { name: 'description', content: 'Modern bahis ve spor platformu ile heyecanı yaşayın!' },
            ],
        }
    },

    css: [
        '~/assets/scss/variables.scss',
        '~/assets/scss/style.scss', 
        '~/assets/css/dashboard.css',
        'bootstrap-icons/font/bootstrap-icons.css'
    ],

    // Modern Sass API kullanarak deprecation warning'leri sustur
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern', // Modern Sass API'sini kullan
                    silenceDeprecations: [
                        'import', 
                        'global-builtin', 
                        'color-functions'
                    ], // Bootstrap'ten gelen uyarıları sustur
                    quietDeps: true // Dependencies'ten gelen uyarıları sustur
                }
            }
        }
    },

    plugins: [
        {
            src: 'plugins/bootstrap.js',
            mode: 'client'
        }
    ],
    components: {global: true, dirs: ['~/components']},
    modules: [
        '@pinia/nuxt',
        '@nuxt/image',
        'pinia-plugin-persistedstate/nuxt',
    ]
})
