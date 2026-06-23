import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkWikiLink from './src/garden/remark-wiki-link.js'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/my-personal-website/',
    plugins: [
        {
            enforce: 'pre',
            ...mdx({
                remarkPlugins: [
                    remarkFrontmatter,
                    [remarkMdxFrontmatter, { name: 'frontmatter' }],
                    remarkGfm,
                    remarkWikiLink
                ],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                ]
            })
        },
        react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Split the swiper plugin library into a separate chunk to avoid a large chunk size on index.js
                        if (id.includes('swiper'))
                            return 'swiper';
                        return;
                    }
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
            },
        },
    },
})
