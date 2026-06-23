import {Link} from "react-router-dom"

/**
 * Renders an area path as a breadcrumb of links into the area pages.
 * Each crumb links to /garden/area/<cumulative-slug-path>.
 *
 * @param {object} props
 * @param {string[]} props.segments      - display segments, e.g. ["Engineering", "Machine Learning"]
 * @param {string[]} props.slugSegments  - slugified segments, e.g. ["engineering", "machine-learning"]
 * @param {boolean} [props.leadingGarden] - prepend a "Garden" crumb linking to /garden
 * @param {number}  [props.activeDepth]   - if set, the crumb at this 1-based depth renders as plain text (current page)
 * @param {string}  [props.className]
 * @param {string}  [props.ariaLabel]
 * @returns {JSX.Element|null}
 */
const AreaBreadcrumb = ({
    segments = [],
    slugSegments = [],
    leadingGarden = false,
    activeDepth = 0,
    className = "garden-breadcrumb",
    ariaLabel = "Breadcrumb"
}) => {
    if (segments.length === 0 && !leadingGarden)
        return null

    return (
        <nav className={className} aria-label={ariaLabel}>
            <ol>
                {leadingGarden && (
                    <li>
                        <Link to="/garden">Garden</Link>
                    </li>
                )}
                {segments.map((segment, i) => {
                    const to = "/garden/area/" + slugSegments.slice(0, i + 1).join("/")
                    const isActive = activeDepth === i + 1
                    return (
                        <li key={i} aria-current={isActive ? "page" : undefined}>
                            {isActive ? <span>{segment}</span> : <Link to={to}>{segment}</Link>}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default AreaBreadcrumb
