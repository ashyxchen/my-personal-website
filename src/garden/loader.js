/**
 * Garden loader
 *
 * Eagerly imports all MDX notes from /content/garden, reads their exported
 * frontmatter (via remark-mdx-frontmatter, exposed as `frontmatter`), and builds
 * a note index plus a bidirectional backlink graph from [[wiki-links]].
 *
 * Frontmatter schema (per note):
 *   title    {string}   - display title
 *   slug     {string}   - URL slug (defaults to the filename)
 *   summary  {string}   - one-line description for the garden index
 *   growth   {string}   - "seedling" | "budding" | "evergreen"
 *   planted  {string}   - ISO date (YYYY-MM-DD)
 *   tended   {string}   - ISO date (YYYY-MM-DD), last meaningful edit
 *   topics   {string[]} - freeform tags
 *   area     {string}   - primary knowledge-base cluster (e.g. "Machine Learning")
 */

const GROWTH_STAGES = {
    seedling: {id: "seedling", label: "Seedling", icon: "🌱", order: 0},
    budding: {id: "budding", label: "Budding", icon: "🌿", order: 1},
    evergreen: {id: "evergreen", label: "Evergreen", icon: "🌳", order: 2}
}

const WIKI_LINK_REGEX = /\[\[([^\]]+)]]/g

// Compiled MDX modules (default export = React component, plus `frontmatter`).
const noteModules = import.meta.glob("/content/garden/*.mdx", {eager: true})

// Raw source of the same files, used to extract [[wiki-links]] for the graph.
const noteSources = import.meta.glob("/content/garden/*.mdx", {
    eager: true,
    query: "?raw",
    import: "default"
})

/**
 * @param {string} path
 * @returns {string}
 */
function slugFromPath(path) {
    return path.split("/").pop().replace(/\.mdx$/, "").toLowerCase()
}

/**
 * @param {string} source
 * @returns {string[]} unique outbound slugs referenced via [[wiki-links]]
 */
function extractOutboundSlugs(source) {
    const slugs = new Set()
    let match
    WIKI_LINK_REGEX.lastIndex = 0
    while ((match = WIKI_LINK_REGEX.exec(source)) !== null) {
        const inner = match[1]
        const slugPart = (inner.includes("|") ? inner.slice(0, inner.indexOf("|")) : inner).trim()
        slugs.add(slugPart.toLowerCase().replace(/\s+/g, "-"))
    }
    return [...slugs]
}

// --- Build the index -------------------------------------------------------

const notesBySlug = {}
const outboundBySlug = {}
const backlinksBySlug = {}

for (const path of Object.keys(noteModules)) {
    const mod = noteModules[path]
    const frontmatter = mod.frontmatter || {}
    const slug = (frontmatter.slug || slugFromPath(path)).toLowerCase()

    notesBySlug[slug] = {
        slug: slug,
        title: frontmatter.title || slug,
        summary: frontmatter.summary || "",
        growth: frontmatter.growth || "seedling",
        planted: frontmatter.planted || null,
        tended: frontmatter.tended || frontmatter.planted || null,
        topics: Array.isArray(frontmatter.topics) ? frontmatter.topics : [],
        area: frontmatter.area || "Uncategorized",
        Component: mod.default,
        frontmatter: frontmatter
    }

    const source = noteSources[path] || ""
    outboundBySlug[slug] = extractOutboundSlugs(source).filter((s) => s !== slug)
}

// Invert the outbound graph into backlinks.
for (const slug of Object.keys(outboundBySlug)) {
    for (const target of outboundBySlug[slug]) {
        if (!backlinksBySlug[target])
            backlinksBySlug[target] = []
        if (!backlinksBySlug[target].includes(slug))
            backlinksBySlug[target].push(slug)
    }
}

// --- Public API ------------------------------------------------------------

/**
 * @returns {object[]} all notes, newest-tended first
 */
export function getAllNotes() {
    return Object.values(notesBySlug).sort((a, b) => {
        return String(b.tended || "").localeCompare(String(a.tended || ""))
    })
}

/**
 * @param {string} slug
 * @returns {object|null}
 */
export function getNoteBySlug(slug) {
    return notesBySlug[String(slug || "").toLowerCase()] || null
}

/**
 * @param {string} slug
 * @returns {object[]} notes that link TO the given slug
 */
export function getBacklinks(slug) {
    const sources = backlinksBySlug[String(slug || "").toLowerCase()] || []
    return sources.map((s) => notesBySlug[s]).filter(Boolean)
}

/**
 * @param {string} slug
 * @returns {object[]} notes the given slug links OUT to
 */
export function getOutboundNotes(slug) {
    const targets = outboundBySlug[String(slug || "").toLowerCase()] || []
    return targets.map((s) => notesBySlug[s]).filter(Boolean)
}

/**
 * @returns {string[]} unique topics across all notes, alphabetical
 */
export function getAllTopics() {
    const topics = new Set()
    for (const note of Object.values(notesBySlug))
        note.topics.forEach((t) => topics.add(t))
    return [...topics].sort()
}

/**
 * @returns {string[]} unique areas across all notes, alphabetical
 */
export function getAllAreas() {
    const areas = new Set()
    for (const note of Object.values(notesBySlug))
        areas.add(note.area)
    return [...areas].sort()
}

/**
 * @param {string} growthId
 * @returns {{id:string,label:string,icon:string,order:number}}
 */
export function getGrowthStage(growthId) {
    return GROWTH_STAGES[growthId] || GROWTH_STAGES.seedling
}

export {GROWTH_STAGES}
