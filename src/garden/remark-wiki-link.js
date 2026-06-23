/**
 * remark-wiki-link (local)
 *
 * Transforms Obsidian-style wiki links inside MDX/Markdown into normal links:
 *   [[slug]]          -> <a href="{base}garden/slug">slug</a>
 *   [[slug|Label]]    -> <a href="{base}garden/slug">Label</a>
 *
 * The base path is read from import.meta env at build time via the BASE_URL
 * Vite injects, falling back to "/". Slugs are lowercased and trimmed.
 */

const WIKI_LINK_REGEX = /\[\[([^\]]+)]]/g

const BASE = (typeof process !== "undefined" && process.env && process.env.BASE_URL) || "/my-personal-website/"

/**
 * @returns {function(import('mdast').Root): void}
 */
export default function remarkWikiLink() {
    return (tree) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || typeof index !== "number")
                return

            const value = node.value
            if (!value.includes("[["))
                return

            const children = []
            let lastIndex = 0
            let match

            WIKI_LINK_REGEX.lastIndex = 0
            while ((match = WIKI_LINK_REGEX.exec(value)) !== null) {
                const [raw, inner] = match
                const start = match.index

                if (start > lastIndex)
                    children.push({type: "text", value: value.slice(lastIndex, start)})

                const pipeIndex = inner.indexOf("|")
                const slugPart = (pipeIndex === -1 ? inner : inner.slice(0, pipeIndex)).trim()
                const labelPart = (pipeIndex === -1 ? inner : inner.slice(pipeIndex + 1)).trim()
                const slug = slugPart.toLowerCase().replace(/\s+/g, "-")
                const url = `${BASE}garden/${slug}`.replace(/\/{2,}/g, "/")

                children.push({
                    type: "link",
                    url: url,
                    data: {hProperties: {className: "wiki-link", "data-slug": slug}},
                    children: [{type: "text", value: labelPart || slugPart}]
                })

                lastIndex = start + raw.length
            }

            if (lastIndex < value.length)
                children.push({type: "text", value: value.slice(lastIndex)})

            if (children.length) {
                parent.children.splice(index, 1, ...children)
                return index + children.length
            }
        })
    }
}

/**
 * Minimal mdast visitor (avoids adding the `unist-util-visit` dependency).
 * Walks the tree depth-first and calls `visitor` on every node of `type`.
 * The visitor may return a number to resume iteration at that child index.
 * @param {object} tree
 * @param {string} type
 * @param {function(object, number, object): (number|void)} visitor
 */
function visit(tree, type, visitor) {
    const walk = (node, index, parent) => {
        if (node.type === type) {
            const result = visitor(node, index, parent)
            if (typeof result === "number")
                return result
        }

        if (node.children) {
            let i = 0
            while (i < node.children.length) {
                const next = walk(node.children[i], i, node)
                i = typeof next === "number" ? next : i + 1
            }
        }
    }

    walk(tree, null, null)
}
