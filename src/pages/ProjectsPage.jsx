import React from 'react'
import {Link} from "react-router-dom"
import {useData} from "/src/providers/DataProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useDocumentMeta} from "/src/garden/useDocumentMeta.js"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

const INTRO = {
    en: "Things I've built — from hackathon wins to a social robot for seniors. Most of it lives at the boundary between hardware and machine learning.",
    fr: "Des choses que j'ai construites — de victoires en hackathon à un robot social pour personnes âgées. La plupart se situent à la frontière entre le matériel et l'apprentissage automatique.",
    zh: "我做过的一些项目 —— 从黑客松获奖作品到为长者设计的社交机器人。大多数都处于硬件与机器学习的交界处。"
}

const _emph = (value = "") =>
    value
        .replace(/\{\{(.*?)\}\}/g, '<span class="accent">$1</span>')
        .replace(/\[\[(.*?)\]\]/g, '$1')

const _getProjects = (data, langId) => {
    const sections = data.getSections() || []
    const portfolio = sections.find(section => section.id === "portfolio")
    const items = portfolio?.data?.articles?.[0]?.items || []
    return items.map(item => {
        const locale = item.locales?.[langId] || item.locales?.en || {}
        return {
            id: item.id,
            noteSlug: item.noteSlug || null,
            title: locale.title,
            text: _emph(locale.text || ""),
            tags: locale.tags || [],
            links: item.preview?.links || []
        }
    })
}

const ProjectsPage = () => {
    const data = useData()
    const language = useLanguage()
    const langId = language.getSelectedLanguage()?.id || "en"
    const pick = (dict) => dict[langId] || dict.en

    useDocumentMeta({
        title: "Projects",
        description: "Projects by Ashton Chen at the boundary between hardware and machine learning — embedded firmware, edge ML, and computer vision."
    })

    const projects = _getProjects(data, langId)

    return (
        <EditorialLayout>
            <main className="editorial-page projects">
                <header className="editorial-page__head">
                    <h1>Projects</h1>
                    <p>{pick(INTRO)}</p>
                </header>

                <ul className="proj-list">
                    {projects.map(project => (
                        <li key={project.id} className="proj-item">
                            <h2 className="proj-item__title">
                                {project.noteSlug
                                    ? <Link to={`/garden/${project.noteSlug}`}>{project.title}</Link>
                                    : project.title}
                            </h2>
                            <div
                                className="proj-item__text"
                                dangerouslySetInnerHTML={{__html: project.text}}
                            />

                            {project.tags.length > 0 && (
                                <ul className="tag-chips">
                                    {project.tags.map(tag => (
                                        <li key={tag} className="tag-chip">{tag}</li>
                                    ))}
                                </ul>
                            )}

                            <div className="proj-item__links">
                                {project.noteSlug && (
                                    <Link to={`/garden/${project.noteSlug}`} className="proj-item__writeup">
                                        Read the write-up →
                                    </Link>
                                )}
                                {project.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className={link.faIcon} aria-hidden="true"/>
                                        <span>View on GitHub</span>
                                    </a>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </EditorialLayout>
    )
}

export default ProjectsPage
