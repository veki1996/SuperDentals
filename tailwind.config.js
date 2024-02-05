/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'hero-image': "url('/home-page-assets/hero-image.jpg')",
				'blog-image': "url('/home-page-assets/blog-bg.png')",
				'mobile-blog-image': "url('/home-page-assets/mobile-blog-bg.png')",
				'contact-image': "url('/home-page-assets/contact-image.jpg')",
				'partners-image': "url('/partners-page-assets/partners-image.png')",
				'marketing-image': "url('/marketing-page-assets/marketingimage.png')",
				'new-contact-image': "url('/contact-page-assets/contact.png')",
			},

			colors: {
				primaryColor: '#FC5122',
				grayColor: '#818181',
				lightBlack: '#21231E',
			},

			boxShadow: {
				container: '1px 0px 5px rgba(0, 0, 0, 0.25)',
				nav: '0px 4px 4px rgba(0, 0, 0, 0.25)',
				lexicon: '1px 1px 6px rgba(0, 0, 0, 0.25)',
				packagesCard: '0px 4px 8px rgba(0, 0, 0, 0.15)',
			},

			gridTemplateColumns: {
				lexicon: 'repeat(4, 48px)',
			},

			fontSize: {
				heading: '50px',
				paragraph: '20px',
			},
			keyframes: {
				copyAppear: {
					'0%': { transfrom: 'translateX(50%, 0px)', opacity: 0 },
					'20%': { transform: 'translate(50%,-25%)', opacity: 1 },
					'80%': { transform: 'translate(50%,0px)', opacity: 1 },
					'100%': { transfrom: 'translateX(50%, 0px)', opacity: 0 },
				},
			},
			animation: {
				coppyAppear: 'copyAppear 1500ms ease',
			},
		},
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#FC5122',
					secondary: '#0D3082',
					accent: '#37cdbe',
					neutral: '#3d4451',
					'base-100': '#ffffff',
				},
			},
		],
	},
	darkMode: 'class',
	plugins: [require('daisyui')],
};
