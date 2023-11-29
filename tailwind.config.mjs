/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['valkyrie', ...defaultTheme.fontFamily.serif],
				caps: ['valkyrie_caps'], // small caps for body text
				sans: ['concourse', ...defaultTheme.fontFamily.sans],
				mono: ['iosevka_fixed', ...defaultTheme.fontFamily.mono],
				headline: ['concourse_caps'], // font for headlines
				outer: ['heliotrope'], // font for notes, margin notes, etc.
				outerCaps: ['heliotrope_caps'], // small caps for notes, margin notes, etc.
			},
			listStyleType: {
				circle: 'circle',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
