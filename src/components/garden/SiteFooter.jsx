import React from 'react'

function SiteFooter() {
    const year = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <p className="site-footer__name">Ashton Chen</p>
                <nav className="site-footer__links">
                    <a href="https://github.com/yuxstar1444" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/ashyuxchen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="mailto:ash.chen@uwaterloo.ca">Email</a>
                </nav>
                <p className="site-footer__copy">© {year} Ashton Chen — built in the open.</p>
            </div>
        </footer>
    )
}

export default SiteFooter
