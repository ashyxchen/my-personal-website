import React from 'react'
import {useData} from "/src/providers/DataProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useDocumentMeta} from "/src/garden/useDocumentMeta.js"
import EditorialLayout from "/src/components/garden/EditorialLayout.jsx"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const LABELS = {
    experience: {en: "Experience", fr: "Expérience", zh: "工作经历"},
    education: {en: "Education", fr: "Éducation", zh: "教育"},
    interests: {en: "Beyond work", fr: "En dehors du travail", zh: "工作之外"},
    present: {en: "Present", fr: "Présent", zh: "至今"}
}

const INTRO = {
    en: "A bit about who I am, where I've worked, and what I get up to when I'm not building.",
    fr: "Un aperçu de qui je suis, où j'ai travaillé et ce que je fais quand je ne construis pas.",
    zh: "关于我是谁、我曾在哪里工作，以及不在做东西时我会做些什么。"
}

const _emph = (value = "") =>
    value
        .replace(/\{\{(.*?)\}\}/g, '<span class="accent">$1</span>')
        .replace(/\[\[(.*?)\]\]/g, '$1')

const _loc = (item, langId) => item?.locales?.[langId] || item?.locales?.en || {}

const _section = (data, id) => (data.getSections() || []).find(section => section.id === id)

const _articleByComponent = (section, component) =>
    section?.data?.articles?.find(article => article.component === component)

const _formatDate = (date, presentLabel) => {
    if (!date || !date.year) return presentLabel
    const month = date.month ? MONTHS[date.month - 1] + " " : ""
    return month + date.year
}

const Timeline = ({items, langId, presentLabel}) => (
    <ol className="about-timeline">
        {items.map(item => {
            const loc = _loc(item, langId)
            const range = `${_formatDate(item.dateStart, presentLabel)} – ${_formatDate(item.dateEnd, presentLabel)}`
            const place = [loc.province, loc.country].filter(Boolean).join(", ")
            return (
                <li key={item.id} className="about-entry">
                    <div className="about-entry__date">{range}</div>
                    <div className="about-entry__body">
                        <h3
                            className="about-entry__title"
                            dangerouslySetInnerHTML={{__html: _emph(loc.title || "")}}
                        />
                        <p className="about-entry__org">
                            {loc.institution}
                            {place && <span className="about-entry__place"> · {place}</span>}
                        </p>
                        {loc.text && (
                            <p
                                className="about-entry__lede"
                                dangerouslySetInnerHTML={{__html: _emph(loc.text)}}
                            />
                        )}
                        {Array.isArray(loc.list) && loc.list.length > 0 && (
                            <ul className="about-entry__list">
                                {loc.list.map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}
                            </ul>
                        )}
                        {Array.isArray(loc.tags) && loc.tags.length > 0 && (
                            <ul className="tag-chips">
                                {loc.tags.map(tag => (
                                    <li key={tag} className="tag-chip">{tag}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </li>
            )
        })}
    </ol>
)

const AboutPage = () => {
    const data = useData()
    const language = useLanguage()
    const langId = language.getSelectedLanguage()?.id || "en"
    const pick = (dict) => dict[langId] || dict.en
    const presentLabel = pick(LABELS.present)

    useDocumentMeta({
        title: "About",
        description: "About Ashton Chen — a Systems Design Engineering student at the University of Waterloo working on embedded firmware, edge ML, and computer vision."
    })

    const aboutSection = _section(data, "about")
    const bioArticle = _articleByComponent(aboutSection, "ArticleText")
    const bioHtml = _emph(_loc(bioArticle?.items?.[0], langId).text || "")

    const interestsArticle = _articleByComponent(aboutSection, "ArticleInfoList")
    const interests = interestsArticle?.items || []

    const experience = _articleByComponent(_section(data, "experience"), "ArticleTimeline")?.items || []
    const education = _articleByComponent(_section(data, "education"), "ArticleTimeline")?.items || []

    return (
        <EditorialLayout>
            <main className="editorial-page about">
                <header className="editorial-page__head">
                    <h1>About</h1>
                    <p>{pick(INTRO)}</p>
                </header>

                {bioHtml && (
                    <section className="about-bio">
                        <div
                            className="about-prose"
                            dangerouslySetInnerHTML={{__html: bioHtml}}
                        />
                    </section>
                )}

                {experience.length > 0 && (
                    <section className="about-section">
                        <h2 className="about-section__title">{pick(LABELS.experience)}</h2>
                        <Timeline items={experience} langId={langId} presentLabel={presentLabel}/>
                    </section>
                )}

                {education.length > 0 && (
                    <section className="about-section">
                        <h2 className="about-section__title">{pick(LABELS.education)}</h2>
                        <Timeline items={education} langId={langId} presentLabel={presentLabel}/>
                    </section>
                )}

                {interests.length > 0 && (
                    <section className="about-section">
                        <h2 className="about-section__title">{pick(LABELS.interests)}</h2>
                        <ul className="about-interests">
                            {interests.map(item => {
                                const loc = _loc(item, langId)
                                return (
                                    <li key={item.id} className="about-interest">
                                        {item.faIcon && (
                                            <i className={item.faIcon} aria-hidden="true"/>
                                        )}
                                        <div>
                                            <h3
                                                className="about-interest__title"
                                                dangerouslySetInnerHTML={{__html: _emph(loc.title || "")}}
                                            />
                                            {loc.text && (
                                                <p className="about-interest__text">{loc.text}</p>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </section>
                )}
            </main>
        </EditorialLayout>
    )
}

export default AboutPage
