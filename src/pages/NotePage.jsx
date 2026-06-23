import {Link, useParams} from "react-router-dom"
import {MDXProvider} from "@mdx-js/react"
import {getNoteBySlug, getBacklinks, getGrowthStage} from "/src/garden/loader.js"
import {mdxComponents} from "/src/garden/mdx-components.jsx"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

/**
 * Individual note page. Resolves the slug from the URL, renders the compiled MDX
 * component, and shows a frontmatter header plus a backlinks panel.
 * @returns {JSX.Element}
 */
const NotePage = () => {
    const {slug} = useParams()
    const note = getNoteBySlug(slug)

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

    return (
        <EditorialLayout>
            <main className="garden-page garden-note">
                <p className="garden-note__back">
                    <Link to="/garden">← The Garden</Link>
                </p>

                <header className="garden-note__header">
                    <h1>{note.title}</h1>
                    <div className="garden-note__meta">
                        <span className="garden-note__growth" title={stage.label}>
                            {stage.icon} {stage.label}
                        </span>
                        {note.planted && <span>Planted {note.planted}</span>}
                        {note.tended && note.tended !== note.planted && (
                            <span>Tended {note.tended}</span>
                        )}
                        {note.area && <span>{note.area}</span>}
                    </div>
                    {note.topics.length > 0 && (
                        <ul className="garden-note__topics">
                            {note.topics.map((topic) => (
                                <li key={topic}>#{topic}</li>
                            ))}
                        </ul>
                    )}
                </header>

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
