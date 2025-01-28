import typography from '@tailwindcss/typography';
import daisyui from "daisyui"


export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: ["lofi"],
	},
	plugins: [
		typography,
		daisyui
	]
};
