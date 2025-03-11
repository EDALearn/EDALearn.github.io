// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from "rehype-mermaid";
import starlightBlog from 'starlight-blog'

// https://astro.build/config
export default defineConfig({
    site: 'https://edalearn.github.io/',
    outDir: 'dist',
    integrations: [
        starlight({
            title: 'EDALearn',
            favicon: '/favicon.png',
            logo: {
                src: './src/assets/event-driven-architectures-logo-transparent.png',
            },
            social: {
                github: 'https://github.com/EDALearn',
            },
            sidebar: [
                {
                    label: 'EDA Learn Projects',
                    autogenerate: {directory: 'projects'},
                },
                {
                    label: 'Reference',
                    autogenerate: {directory: 'reference'},
                },
            ],
            plugins: [
                starlightBlog({
                    postCount: 15,
                    authors: {
                        edalearn: {
                            name: 'EDALearn',
                            title: 'Community Driven Resources and Playground Projects to Share and Learn about Event-Driven Architectures!',
                            picture: 'https://fmvilas.me/static/images/mobile-header.png', // Images in the `public` directory are supported.
                            url: 'https://fmvilas.me/',
                        },
                        fmvilas: {
                            name: 'Fran Mendez',
                            title: 'Creator of AsyncAPI',
                            picture: 'https://fmvilas.me/static/images/mobile-header.png', // Images in the `public` directory are supported.
                            url: 'https://fmvilas.me/',
                        },
                        ivangsa: {
                            name: 'Ivan Garcia Sainz-Aja',
                            title: 'Building ZenWave360º',
                            picture: '/blog/authors/ivangsa.jpg',
                            url: 'https://www.zenwave360.io/',
                        },
                    },
                })],
        }),
    ],
    markdown: {
        rehypePlugins: [
            rehypeMermaid,
        ],
    },
});
