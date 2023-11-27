/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['valkyrie', ...defaultTheme.fontFamily.serif],
				sans: ['concourse', ...defaultTheme.fontFamily.sans],
				mono: ['iosevka_fixed', ...defaultTheme.fontFamily.mono],
				headline: ['concourse_caps'],
			},
			listStyleType: {
				circle: 'circle',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
