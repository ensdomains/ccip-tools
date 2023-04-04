/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './index.html',
    ],
    theme: {
        extend: {
            screens: {
                xs: '420px',
                md: '801px',
            },
            colors: {
                ens: {
                    blue: '#5298FF',
                    green: '#49B393',
                    red: '#D55555',
                    orange: '#FF9500',
                    indigo: '#5854D6',
                    pink: '#FF2D55',
                    purple: '#AF52DE',
                    teal: '#5AC8FA',
                    yellow: '#E8B811',
                    grey: '#E8E8E8',
                    black: '#333333',
                    grey3: '#454545',
                    grey2: '#9B9BA7',
                    grey1: '#F6F6F6',
                    white: '#FFFFFF',
                    bluelight: '#EEF5FF',
                    redlight: '#F9E7E7',
                    greenlight: '#E7F4EF',
                    yellowlight: '#FFF5CD',
                    lgradient: '',
                },

                // brand
                discord: '#535dd8',
                twitter: '#65C5FC',
            },
            backgroundImage: (theme) => ({
                'ens-gradient-primary':
                    'linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)',
            }),
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
            },
        },
    },
    plugins: [],
};
