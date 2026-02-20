/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#ee7c2b',
                    dark: '#d46a1f',
                    light: '#f5a060',
                },
                dark: {
                    DEFAULT: '#221810',
                    deep: '#1a1207',
                    card: '#2a1f14',
                },
            },
            fontFamily: {
                display: ['"Be Vietnam Pro"', 'sans-serif'],
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
            },
        },
    },
    plugins: [],
}
