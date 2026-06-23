import React from 'react'
import {Link, NavLink} from "react-router-dom"
import {useData} from "/src/providers/DataProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import NavToolThemePicker from "/src/components/nav/tools/NavToolThemePicker.jsx"
import NavToolLanguagePicker from "/src/components/nav/tools/NavToolLanguagePicker.jsx"

function SiteHeader() {
    const data = useData()
    const language = useLanguage()

    const profile = data.getProfile()
    const langId = language.getSelectedLanguage()?.id
    const name = profile?.locales?.[langId]?.localized_name || profile?.name || "Ashton Chen"

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <Link to="/" className="site-header__brand">{name}</Link>

                <nav className="site-header__nav">
                    <NavLink to="/garden" className="site-header__link">Garden</NavLink>
                    <NavLink to="/projects" className="site-header__link">Projects</NavLink>
                    <NavLink to="/about" className="site-header__link">About</NavLink>
                    <span className="site-header__tools">
                        <NavToolThemePicker/>
                        <NavToolLanguagePicker/>
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default SiteHeader
