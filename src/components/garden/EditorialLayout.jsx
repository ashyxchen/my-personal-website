import React, {useEffect} from 'react'
import SiteHeader from "/src/components/garden/SiteHeader.jsx"
import SiteFooter from "/src/components/garden/SiteFooter.jsx"

/**
 * Wraps editorial / garden routes with the shared header + footer and unlocks
 * the body so these long-scroll pages can scroll (the template locks the body
 * to a fixed viewport for its slideshow on desktop).
 */
function EditorialLayout({children}) {
    useEffect(() => {
        document.body.classList.add("body-flow")
        window.scrollTo(0, 0)
        return () => document.body.classList.remove("body-flow")
    }, [])

    return (
        <div className="editorial">
            <SiteHeader/>
            {children}
            <SiteFooter/>
        </div>
    )
}

export default EditorialLayout
