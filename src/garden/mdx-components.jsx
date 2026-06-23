import {Link} from "react-router-dom"

/**
 * Component overrides passed to <MDXProvider> so that rendered MDX uses the
 * app's styling and client-side links. Wiki-links produced by the remark plugin
 * carry a `data-slug` attribute and an absolute href; we intercept internal
 * garden links and route them through React Router.
 */

const InternalAwareLink = ({href = "", children, ...rest}) => {
    const base = import.meta.env.BASE_URL || "/"
    const isInternal = href.startsWith(base) || href.startsWith("/garden")

    if (isInternal) {
        const to = href.startsWith(base) ? "/" + href.slice(base.length) : href
        return <Link to={to.replace(/\/{2,}/g, "/")} {...rest}>{children}</Link>
    }

    const external = /^https?:\/\//.test(href)
    return (
        <a href={href}
           {...(external ? {target: "_blank", rel: "noopener noreferrer"} : {})}
           {...rest}>
            {children}
        </a>
    )
}

const Callout = ({type = "note", children}) => (
    <aside className={`garden-callout garden-callout--${type}`}>
        {children}
    </aside>
)

export const mdxComponents = {
    a: InternalAwareLink,
    Callout
}

export default mdxComponents
