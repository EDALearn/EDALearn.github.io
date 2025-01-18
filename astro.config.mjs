// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'EDALearn',
			logo: {
				src: './src/assets/event-driven-architectures-logo-transparent.png',
			},
			social: {
				github: 'https://github.com/EDALearn',
			},
			sidebar: [
				{
					label: 'EDA Learn Projects',
					autogenerate: { directory: 'projects' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
