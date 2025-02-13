/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,ts}", // Scans all HTML and TypeScript files in src
    ],
    theme: {
        extend: {
            colors: {
                main: {
                    50: 'var(--main-50)',
                    100: 'var(--main-100)',
                    200: 'var(--main-200)',
                    300: 'var(--main-300)',
                    400: 'var(--main-400)',
                    500: 'var(--main-500)',
                    600: 'var(--main-600)',
                    700: 'var(--main-700)',
                    800: 'var(--main-800)',
                    900: 'var(--main-900)',
                },

            },
        },
    },
    plugins: [
        require('daisyui'),
    ],
};