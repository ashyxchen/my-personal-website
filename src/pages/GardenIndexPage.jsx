import {Link} from "react-router-dom"
import {getAllNotes, getGrowthStage} from "/src/garden/loader.js"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

/**
 * Garden index. Phase 1 renders a simple list of all notes; topic / growth-stage
 * filtering arrives in Phase 3 (REDESIGN.md).
 * @returns {JSX.Element}
 */
const GardenIndexPage = () => {
    const notes = getAllNotes()

    return (
        <EditorialLayout>
            <main className="garden-page">
                <header className="garden-page__header">
                    <h1>The Garden</h1>
                    <p>
                        A collection of notes and ideas growing slowly over time.
                        Nothing here is finished.
                    </p>
                </header>

                {notes.length === 0 && (
                    <p className="garden-empty">No notes planted yet.</p>
                )}

                <ul className="garden-list">
                    {notes.map((note) => {
                        const stage = getGrowthStage(note.growth)
                        return (
                            <li key={note.slug} className="garden-list__item">
                                <Link to={`/garden/${note.slug}`} className="garden-list__link">
                                    <span className="garden-list__growth" title={stage.label}>
                                        {stage.icon}
                                    </span>
                                    <span className="garden-list__body">
                                        <span className="garden-list__title">{note.title}</span>
                                        {note.summary && (
                                            <span className="garden-list__summary">{note.summary}</span>
                                        )}
                                        <span className="garden-list__meta">
                                            {note.area}
                                            {note.topics.length > 0 && " · " + note.topics.join(", ")}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </main>
        </EditorialLayout>
    )
}

export default GardenIndexPage
