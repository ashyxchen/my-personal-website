import {useParams, Link} from "react-router-dom"
import {
    getArea,
    getSubAreas,
    getNotesInArea,
    getGrowthStage
} from "/src/garden/loader.js"
import {useDocumentMeta} from "/src/garden/useDocumentMeta.js"
import AreaBreadcrumb from "/src/components/garden/AreaBreadcrumb.jsx"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

/**
 * Browsable area page. Lists the sub-areas filed under a given path and the
 * notes that live directly in it. The root (/garden/area) lists top-level areas.
 * @returns {JSX.Element}
 */
const AreaPage = () => {
    const params = useParams()
    const slugPath = String(params["*"] || "")
        .replace(/\/+$/, "")
        .toLowerCase()

    const isRoot = slugPath === ""
    const area = isRoot ? null : getArea(slugPath)

    const title = area ? area.segments.join(" / ") : "Areas"
    useDocumentMeta({
        title: title,
        description: area
            ? `Notes and projects filed under ${area.segments.join(" / ")}.`
            : "Browse the garden by area."
    })

    if (!isRoot && !area) {
        return (
            <EditorialLayout>
                <main className="garden-page">
                    <p className="garden-empty">
                        That area doesn't exist. <Link to="/garden">Back to the garden</Link>.
                    </p>
                </main>
            </EditorialLayout>
        )
    }

    const subAreas = getSubAreas(slugPath)
    const notesHere = getNotesInArea(slugPath)

    return (
        <EditorialLayout>
            <main className="garden-page">
                {area ? (
                    <AreaBreadcrumb
                        segments={area.segments}
                        slugSegments={area.slugSegments}
                        leadingGarden={true}
                        activeDepth={area.segments.length}
                    />
                ) : (
                    <p className="garden-note__back">
                        <Link to="/garden">← The Garden</Link>
                    </p>
                )}

                <header className="garden-page__header">
                    <h1>{area ? area.label : "Areas"}</h1>
                    <p>
                        {area
                            ? "Everything filed under this area, plus any sub-areas nested below it."
                            : "Browse the garden by subject. Each area collects the notes and projects filed beneath it."}
                    </p>
                </header>

                {subAreas.length > 0 && (
                    <ul className="garden-areas">
                        {subAreas.map((sub) => {
                            const count = getNotesInArea(sub.slugPath, {
                                includeDescendants: true
                            }).length
                            return (
                                <li key={sub.slugPath} className="garden-area">
                                    <Link
                                        to={"/garden/area/" + sub.slugPath}
                                        className="garden-area__link"
                                    >
                                        <span className="garden-area__name">{sub.label}</span>
                                        <span className="garden-area__count">
                                            {count} {count === 1 ? "note" : "notes"}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}

                {notesHere.length > 0 && (
                    <ul className="garden-list">
                        {notesHere.map((note) => {
                            const stageInfo = getGrowthStage(note.growth)
                            return (
                                <li key={note.slug} className="garden-list__item">
                                    <Link
                                        to={`/garden/${note.slug}`}
                                        className="garden-list__link"
                                    >
                                        <span
                                            className="garden-list__growth"
                                            title={stageInfo.label}
                                        >
                                            {note.type === "project" ? "🛠️" : stageInfo.icon}
                                        </span>
                                        <span className="garden-list__body">
                                            <span className="garden-list__title">{note.title}</span>
                                            {note.summary && (
                                                <span className="garden-list__summary">
                                                    {note.summary}
                                                </span>
                                            )}
                                            {note.topics.length > 0 && (
                                                <span className="garden-list__meta">
                                                    {note.topics.map((t) => "#" + t).join(" ")}
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}

                {subAreas.length === 0 && notesHere.length === 0 && (
                    <p className="garden-empty">Nothing filed here yet.</p>
                )}
            </main>
        </EditorialLayout>
    )
}

export default AreaPage
