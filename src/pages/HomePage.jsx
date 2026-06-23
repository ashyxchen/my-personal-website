import React from 'react'
import {Link} from "react-router-dom"
import {useData} from "/src/providers/DataProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"
import {getAllNotes, getGrowthStage} from "/src/garden/loader.js"

const HERO = {
    en: "I work at the seam where embedded firmware meets machine learning.",
    fr: "Je travaille à la jonction entre le firmware embarqué et l'apprentissage automatique.",
    zh: "我在嵌入式固件与机器学习的交界处工作。"
}

const HERO_SUB = {
    en: "Systems Design Engineering at the University of Waterloo. I like getting models to run on the small, power-starved hardware that sits closest to the real world — and writing down what I learn along the way.",
    fr: "Génie de la conception de systèmes à l'Université de Waterloo. J'aime faire tourner des modèles sur le matériel exigu et économe en énergie le plus proche du monde réel — et noter ce que j'apprends en chemin.",
    zh: "滑铁卢大学系统设计工程专业。我喜欢让模型运行在最贴近真实世界、资源受限的小型硬件上，并把一路所学记录下来。"
}

const GARDEN_INTRO = {
    en: "A growing collection of notes on firmware, edge AI, and the things I'm figuring out. Some are seedlings, some have had time to grow.",
    fr: "Une collection de notes en croissance sur le firmware, l'edge AI et ce que je suis en train de comprendre. Certaines sont des pousses, d'autres ont eu le temps de grandir.",
    zh: "关于固件、边缘 AI 以及我正在摸索的种种内容，一片不断生长的笔记。有的还是幼苗，有的已经长成。"
}

const PROJECTS_INTRO = {
    en: "A few things I've built — from hackathon wins to a social robot for seniors.",
    fr: "Quelques réalisations — de victoires en hackathon à un robot social pour personnes âgées.",
    zh: "我做过的一些项目 —— 从黑客松获奖作品到为长者设计的社交机器人。"
}

const ABOUT = {
    en: "I'm a Systems Design Engineering student in Toronto who keeps drifting toward the boundary between hardware and intelligence. Lately that means embedded firmware, computer vision, and squeezing models onto microcontrollers. When I'm not building, I'm usually writing it all down in the garden.",
    fr: "Je suis étudiant en génie de la conception de systèmes à Toronto, toujours attiré par la frontière entre le matériel et l'intelligence. En ce moment, cela veut dire firmware embarqué, vision par ordinateur et compression de modèles pour microcontrôleurs. Quand je ne construis pas, j'écris tout ça dans le jardin.",
    zh: "我是多伦多的一名系统设计工程专业学生，总是被硬件与智能之间的边界所吸引。最近主要是嵌入式固件、计算机视觉，以及把模型塞进微控制器。不在动手做东西的时候，我通常在花园里把这些记录下来。"
}

const LABELS = {
    garden: {en: "The Garden", fr: "Le Jardin", zh: "花园"},
    projects: {en: "Projects", fr: "Projets", zh: "项目"},
    about: {en: "About", fr: "À propos", zh: "关于"},
    enterGarden: {en: "Enter the garden →", fr: "Entrer dans le jardin →", zh: "进入花园 →"},
    allProjects: {en: "See all projects →", fr: "Voir tous les projets →", zh: "查看所有项目 →"}
}

const _stripHtml = (value) => (value || "").replace(/<[^>]+>/g, "").trim()

const _getProjects = (data, langId) => {
    const sections = data.getSections() || []
    const portfolio = sections.find(section => section.id === "portfolio")
    const items = portfolio?.data?.articles?.[0]?.items || []
    return items.map(item => {
        const locale = item.locales?.[langId] || item.locales?.en || {}
        const href = item.preview?.links?.[0]?.href || null
        return {
            id: item.id,
            title: locale.title,
            text: _stripHtml(locale.text),
            href
        }
    })
}

const HomePage = () => {
    const data = useData()
    const language = useLanguage()
    const langId = language.getSelectedLanguage()?.id || "en"

    const pick = (dict) => dict[langId] || dict.en

    const notes = getAllNotes().slice(0, 4)
    const projects = _getProjects(data, langId)

    return (
        <EditorialLayout>
            <main className="home">
                <section className="home-hero">
                    <h1 className="home-hero__statement">{pick(HERO)}</h1>
                    <p className="home-hero__subtitle">{pick(HERO_SUB)}</p>
                </section>

                <section className="home-section">
                    <div className="home-section__head">
                        <h2><Link to="/garden">{pick(LABELS.garden)}</Link></h2>
                        <p>{pick(GARDEN_INTRO)}</p>
                    </div>

                    {notes.length > 0 && (
                        <ul className="home-list">
                            {notes.map(note => {
                                const stage = getGrowthStage(note.growth)
                                return (
                                    <li key={note.slug}>
                                        <Link to={`/garden/${note.slug}`}>
                                            <span className="home-list__growth" aria-hidden="true">{stage?.icon}</span>
                                            <span className="home-list__title">{note.title}</span>
                                            {note.summary && (
                                                <span className="home-list__summary">{note.summary}</span>
                                            )}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    )}

                    <Link className="home-section__more" to="/garden">{pick(LABELS.enterGarden)}</Link>
                </section>

                <section className="home-section">
                    <div className="home-section__head">
                        <h2>{pick(LABELS.projects)}</h2>
                        <p>{pick(PROJECTS_INTRO)}</p>
                    </div>

                    <ul className="home-list">
                        {projects.map(project => (
                            <li key={project.id}>
                                {project.href ? (
                                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                                        <span className="home-list__title">{project.title}</span>
                                        {project.text && (
                                            <span className="home-list__summary">{project.text}</span>
                                        )}
                                    </a>
                                ) : (
                                    <Link to="/projects">
                                        <span className="home-list__title">{project.title}</span>
                                        {project.text && (
                                            <span className="home-list__summary">{project.text}</span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <Link className="home-section__more" to="/projects">{pick(LABELS.allProjects)}</Link>
                </section>

                <section className="home-section">
                    <div className="home-section__head">
                        <h2>{pick(LABELS.about)}</h2>
                    </div>
                    <div className="home-prose">
                        <p>{pick(ABOUT)}</p>
                    </div>
                </section>
            </main>
        </EditorialLayout>
    )
}

export default HomePage
