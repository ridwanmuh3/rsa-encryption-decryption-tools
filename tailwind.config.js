/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.{html,js}'],
	theme: {
		extend: {
			colors: {
				bg: '#fcfcca',
				main: '#87CEEB',
				mainAccent: '#51b8e1', // not needed for shadcn
				ebonyBlack: '#282C35',
				snowWhite: '#FFFAFA'
			},
			borderRadius: {
				base: '5px'
			},
			boxShadow: {
				base: '5px 5px 0px 0px #282C35'
			},
			translate: {
				boxShadowX: '5px',
				boxShadowY: '5px'
			},
			fontWeight: {
				base: '500',
				heading: '700'
			},
			fontFamily: {
				sans: ['Archivo', 'sans-serif']
			}
		}
	},
	plugins: []
}
