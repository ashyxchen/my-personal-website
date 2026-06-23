import {Link, useParams} from "react-router-dom"
import {MDXProvider} from "@mdx-js/react"
import {getNoteBySlug, getBacklinks, getGrowthStage} from "/src/garden/loader.js"
import {mdxComponents} from "/src/garden/mdx-components.jsx"
import {useDocumentMeta} from "/src/garden/useDocumentMeta.js"
import AreaBreadcrumb from "/src/components/garden/AreaBreadcrumb.jsx"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

const STATUS_LABELS = {
    "in-progress": "In progress",
    "shipped": "Shipped",
    "archived": "Archived"
}

/**
 * Individual note page. Resolves the slug from the URL, renders the compiled MDX
 * component, and shows a frontmatter header plus a backlinks panel.
 * @returns {JSX.Element}
 */
const NotePage = () => {
    const {slug} = useParams()
    const note = getNoteBySlug(slug)

    useDocumentMeta({
        title: note ? note.title : "Note not found",
        description: note
            ? (note.summary || `A ${note.growth} note on ${note.area}.`)
            : undefined
    })

    if (!note) {
        return (
            <EditorialLayout>
                <main className="garden-page">
                    <p className="garden-empty">
                        This note doesn't exist (yet). <Link to="/garden">Back to the garden</Link>.
                    </p>
                </main>
            </EditorialLayout>
        )
    }

    const stage = getGrowthStage(note.growth)
    const backlinks = getBacklinks(note.slug)
    const Note = note.Component
    const isProject = note.type === "project"

    return (
        <EditorialLayout>
            <main className="garden-page garden-note">
                <p className="garden-note__back">
                    <Link to="/garden">← The Garden</Link>
                </p>

                {note.areaPath.length > 0 && (
                    <AreaBreadcrumb
                        segments={note.areaPath}
                        slugSegments={note.areaSlugPath}
                        className="garden-breadcrumb garden-breadcrumb--note"
                    />
                )}

                <header className="garden-note__header">
                    <h1>{note.title}</h1>
                    <div className="garden-note__meta">
                        {isProject && note.status && (
                            <span className={"garden-status garden-status--" + note.status}>
                                {STATUS_LABELS[note.status] || note.status}
                            </span>
                        )}
                        {!isProject && (
                            <span className="garden-note__growth" title={stage.label}>
                                {stage.icon} {stage.label}
                            </span>
                        )}
                        {note.timeframe && <span>{note.timeframe}</span>}
                        {note.planted && <span>Planted {note.planted}</span>}
                        {note.tended && note.tended !== note.planted && (
                            <span>Tended {note.tended}</span>
                        )}
                    </div>
                    {note.topics.length > 0 && (
                        <ul className="garden-note__topics">
                            {note.topics.map((topic) => (
                                <li key={topic}>#{topic}</li>
                            ))}
                        </ul>
                    )}
                </header>

                {isProject && (
                    <aside className="garden-projbox">
                        {note.role && (
                            <div className="garden-projbox__row">
                                <span className="garden-projbox__key">Role</span>
                                <span className="garden-projbox__val">{note.role}</span>
                            </div>
                        )}
                        {note.tools.length > 0 && (
                            <div className="garden-projbox__row">
                                <span className="garden-projbox__key">Tools</span>
                                <ul className="garden-tags">
                                    {note.tools.map((t) => (
                                        <li key={t} className="garden-tag">{t}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {note.hardware.length > 0 && (
                            <div className="garden-projbox__row">
                                <span className="garden-projbox__key">Hardware / CAD</span>
                                <ul className="garden-tags">
                                    {note.hardware.map((h) => (
                                        <li key={h} className="garden-tag">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {note.outcomes.length > 0 && (
                            <div className="garden-projbox__row">
                                <span className="garden-projbox__key">Outcomes</span>
                                <ul className="garden-projbox__outcomes">
                                    {note.outcomes.map((o, i) => (
                                        <li key={i}>{o}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {note.links.length > 0 && (
                            <div className="garden-projbox__row">
                                <span className="garden-projbox__key">Links</span>
                                <span className="garden-projbox__links">
                                    {note.links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.label || link.href}
                                        </a>
                                    ))}
                                </span>
                            </div>
                        )}
                    </aside>
                )}

                <article className="garden-prose">
                    <MDXProvider components={mdxComponents}>
                        <Note components={mdxComponents}/>
                    </MDXProvider>
                </article>

                {backlinks.length > 0 && (
                    <footer className="garden-backlinks">
                        <h2>Notes that link here</h2>
                        <ul>
                            {backlinks.map((b) => (
                                <li key={b.slug}>
                                    <Link to={`/garden/${b.slug}`}>{b.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </footer>
                )}
            </main>
        </EditorialLayout>
    )
}

export default NotePage
