import {useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {getNotesByType, getGrowthStage, GROWTH_STAGES} from "/src/garden/loader.js"
import {useDocumentMeta} from "/src/garden/useDocumentMeta.js"
import AreaBreadcrumb from "/src/components/garden/AreaBreadcrumb.jsx"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

const STAGE_ORDER = Object.values(GROWTH_STAGES).sort((a, b) => a.order - b.order)

const STATUSES = [
    {id: "in-progress", label: "In progress"},
    {id: "shipped", label: "Shipped"},
    {id: "archived", label: "Archived"}
]

const statusLabel = (id) => (STATUSES.find((s) => s.id === id) || {}).label || id

const uniqueSorted = (values) => [...new Set(values)].sort()

/**
 * Wiki tab — knowledge-base notes, filterable by growth stage and topic.
 */
const WikiPanel = ({notes}) => {
    const topics = useMemo(() => uniqueSorted(notes.flatMap((n) => n.topics)), [notes])
    const [stage, setStage] = useState("all")
    const [topic, setTopic] = useState("all")

    const visible = useMemo(() => {
        return notes.filter((note) => {
            const matchesStage = stage === "all" || note.growth === stage
            const matchesTopic = topic === "all" || note.topics.includes(topic)
            return matchesStage && matchesTopic
        })
    }, [notes, stage, topic])

    const groups = useMemo(() => {
        const byArea = new Map()
        for (const note of visible) {
            if (!byArea.has(note.area))
                byArea.set(note.area, {
                    area: note.area,
                    areaPath: note.areaPath,
                    areaSlugPath: note.areaSlugPath,
                    notes: []
                })
            byArea.get(note.area).notes.push(note)
        }
        return [...byArea.values()].sort((a, b) => a.area.localeCompare(b.area))
    }, [visible])

    return (
        <>
            <div className="garden-filters">
                <div className="garden-filters__group" role="group" aria-label="Filter by growth stage">
                    <span className="garden-filters__label">Growth</span>
                    <button
                        type="button"
                        className={"garden-chip" + (stage === "all" ? " garden-chip--active" : "")}
                        onClick={() => setStage("all")}
                    >
                        All
                    </button>
                    {STAGE_ORDER.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            className={"garden-chip" + (stage === s.id ? " garden-chip--active" : "")}
                            onClick={() => setStage(s.id)}
                            title={s.label}
                        >
                            <span aria-hidden="true">{s.icon}</span> {s.label}
                        </button>
                    ))}
                </div>

                {topics.length > 0 && (
                    <div className="garden-filters__group" role="group" aria-label="Filter by topic">
                        <span className="garden-filters__label">Topic</span>
                        <button
                            type="button"
                            className={"garden-chip" + (topic === "all" ? " garden-chip--active" : "")}
                            onClick={() => setTopic("all")}
                        >
                            All
                        </button>
                        {topics.map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={"garden-chip" + (topic === t ? " garden-chip--active" : "")}
                                onClick={() => setTopic(t)}
                            >
                                #{t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {visible.length === 0 && (
                <p className="garden-empty">
                    {notes.length === 0
                        ? "No notes planted yet."
                        : "No notes match these filters yet."}
                </p>
            )}

            {groups.map((group) => (
                <section key={group.area} className="garden-group">
                    <AreaBreadcrumb
                        segments={group.areaPath}
                        slugSegments={group.areaSlugPath}
                        ariaLabel="Category"
                    />
                    <ul className="garden-list">
                        {group.notes.map((note) => {
                            const stageInfo = getGrowthStage(note.growth)
                            return (
                                <li key={note.slug} className="garden-list__item">
                                    <Link to={`/garden/${note.slug}`} className="garden-list__link">
                                        <span className="garden-list__growth" title={stageInfo.label}>
                                            {stageInfo.icon}
                                        </span>
                                        <span className="garden-list__body">
                                            <span className="garden-list__title">{note.title}</span>
                                            {note.summary && (
                                                <span className="garden-list__summary">{note.summary}</span>
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
                </section>
            ))}
        </>
    )
}

/**
 * Projects tab — engineering write-ups, filterable by status and tool.
 */
const ProjectsPanel = ({notes}) => {
    const tools = useMemo(
        () => uniqueSorted(notes.flatMap((n) => [...n.tools, ...n.hardware])),
        [notes]
    )
    const [status, setStatus] = useState("all")
    const [tool, setTool] = useState("all")

    const visible = useMemo(() => {
        return notes.filter((note) => {
            const matchesStatus = status === "all" || note.status === status
            const matchesTool =
                tool === "all" || [...note.tools, ...note.hardware].includes(tool)
            return matchesStatus && matchesTool
        })
    }, [notes, status, tool])

    return (
        <>
            <div className="garden-filters">
                <div className="garden-filters__group" role="group" aria-label="Filter by status">
                    <span className="garden-filters__label">Status</span>
                    <button
                        type="button"
                        className={"garden-chip" + (status === "all" ? " garden-chip--active" : "")}
                        onClick={() => setStatus("all")}
                    >
                        All
                    </button>
                    {STATUSES.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            className={"garden-chip" + (status === s.id ? " garden-chip--active" : "")}
                            onClick={() => setStatus(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {tools.length > 0 && (
                    <div className="garden-filters__group" role="group" aria-label="Filter by tool">
                        <span className="garden-filters__label">Tool</span>
                        <button
                            type="button"
                            className={"garden-chip" + (tool === "all" ? " garden-chip--active" : "")}
                            onClick={() => setTool("all")}
                        >
                            All
                        </button>
                        {tools.map((t) => (
                            <button
                                key={t}
                                type="button"
                                className={"garden-chip" + (tool === t ? " garden-chip--active" : "")}
                                onClick={() => setTool(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {visible.length === 0 && (
                <p className="garden-empty">
                    {notes.length === 0
                        ? "No projects written up yet."
                        : "No projects match these filters yet."}
                </p>
            )}

            <ul className="garden-proj-list">
                {visible.map((note) => {
                    const chips = [...note.tools, ...note.hardware]
                    return (
                        <li key={note.slug} className="garden-proj">
                            <Link to={`/garden/${note.slug}`} className="garden-proj__link">
                                <div className="garden-proj__head">
                                    <h2 className="garden-proj__title">{note.title}</h2>
                                    {note.status && (
                                        <span className={"garden-status garden-status--" + note.status}>
                                            {statusLabel(note.status)}
                                        </span>
                                    )}
                                </div>
                                {note.summary && (
                                    <p className="garden-proj__summary">{note.summary}</p>
                                )}
                                {chips.length > 0 && (
                                    <ul className="garden-tags">
                                        {chips.map((c) => (
                                            <li key={c} className="garden-tag">{c}</li>
                                        ))}
                                    </ul>
                                )}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

/**
 * Garden index with two tabs: a Wiki knowledge base and a Projects log.
 * @returns {JSX.Element}
 */
const GardenIndexPage = () => {
    const wikiNotes = getNotesByType("wiki")
    const projectNotes = getNotesByType("project")
    const [tab, setTab] = useState("wiki")

    useDocumentMeta({
        title: "The Garden",
        description: "A digital garden — a wiki of notes on embedded firmware, edge ML, and computer vision, plus write-ups of the things I build."
    })

    return (
        <EditorialLayout>
            <main className="garden-page">
                <header className="garden-page__header">
                    <h1>The Garden</h1>
                    <p>
                        Part wiki, part workshop. The <strong>Wiki</strong> holds notes and
                        concepts I'm working through; <strong>Projects</strong> are write-ups
                        of the things I build and the thinking behind them.
                    </p>
                </header>

                <div className="garden-tabs" role="tablist" aria-label="Garden sections">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "wiki"}
                        className={"garden-tab" + (tab === "wiki" ? " garden-tab--active" : "")}
                        onClick={() => setTab("wiki")}
                    >
                        Wiki <span className="garden-tab__count">{wikiNotes.length}</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "project"}
                        className={"garden-tab" + (tab === "project" ? " garden-tab--active" : "")}
                        onClick={() => setTab("project")}
                    >
                        Projects <span className="garden-tab__count">{projectNotes.length}</span>
                    </button>
                </div>

                {tab === "wiki"
                    ? <WikiPanel notes={wikiNotes}/>
                    : <ProjectsPanel notes={projectNotes}/>}
            </main>
        </EditorialLayout>
    )
}

export default GardenIndexPage
