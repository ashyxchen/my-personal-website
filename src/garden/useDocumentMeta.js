import {useEffect} from "react"

const SITE_NAME = "Ashton Chen"

/**
 * Imperatively sets the document title and the description / Open Graph / Twitter
 * meta tags for a route, then restores the previous values on unmount. Keeps the
 * site dependency-free (no react-helmet) while still giving each page its own
 * crawlable head metadata after client-side navigation.
 *
 * @param {{title?: string, description?: string}} meta
 */
export function useDocumentMeta({title, description} = {}) {
    useEffect(() => {
        const fullTitle = title ? `${title} — ${SITE_NAME}` : null
        const previousTitle = document.title

        const targets = [
            {selector: 'meta[name="description"]', value: description},
            {selector: 'meta[property="og:title"]', value: fullTitle},
            {selector: 'meta[property="og:description"]', value: description},
            {selector: 'meta[property="twitter:title"]', value: fullTitle},
            {selector: 'meta[property="twitter:description"]', value: description}
        ]

        const restore = []

        if (fullTitle)
            document.title = fullTitle

        for (const {selector, value} of targets) {
            if (!value)
                continue
            const el = document.head.querySelector(selector)
            if (!el)
                continue
            restore.push({el, value: el.getAttribute("content")})
            el.setAttribute("content", value)
        }

        return () => {
            document.title = previousTitle
            for (const {el, value} of restore) {
                if (value === null)
                    el.removeAttribute("content")
                else
                    el.setAttribute("content", value)
            }
        }
    }, [title, description])
}
