/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                secondary: '#94a3b8',
                'accent-primary': '#38bdf8',
            }
        },
    },
    plugins: [],
}
