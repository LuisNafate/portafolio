import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Github, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Experience = lazy(() => import('./Experience.jsx'))
const asset = (path) => `${import.meta.env.BASE_URL}${path}`

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01',
    title: 'LOSSLESSO',
    eyebrow: 'Mobile · Audio intelligence',
    description: 'Aplicación Android para analizar fidelidad de audio sin nube, explorar espectrogramas y comparar archivos locales con una experiencia visual enfocada en el detalle.',
    tags: ['Flutter', 'Riverpod', 'SQLite', 'FFmpeg'],
    image: asset('projects/losslesso.webp'),
    url: 'https://github.com/LuisNafate/LossLesso',
    accent: '#d9ff43',
  },
  {
    id: '02',
    title: 'TOKA TRIBE',
    eyebrow: 'Product · Community rewards',
    description: 'Experiencia digital de comunidad y recompensas con una identidad visual propia, protagonizada por una familia de ajolotes y una interfaz construida con Next.js.',
    tags: ['Next.js', 'React', 'TypeScript', 'Product UI'],
    image: asset('projects/toka-tribe.webp'),
    url: 'https://github.com/LuisNafate/Toka-tribe-frontend',
    accent: '#ff91bd',
  },
  {
    id: '03',
    title: 'ENJAMBRE',
    eyebrow: 'Creative web · Music experience',
    description: 'Experiencia web interactiva inspirada en el universo visual de Enjambre: portada, vinilo y movimiento se combinan en una pieza digital con carácter editorial.',
    tags: ['Next.js', 'React', 'Creative Dev', 'Audio'],
    image: asset('projects/enjambre.webp'),
    url: 'https://github.com/LuisNafate/enjambre-page',
    accent: '#ff792d',
  },
  {
    id: '04',
    title: 'TOURNIFY',
    eyebrow: 'Web app · Competition systems',
    description: 'Arquitectura modular para organizar torneos deportivos y de eSports, con perfiles de jugadores, organizadores y árbitros.',
    tags: ['Angular', 'TypeScript', 'Tailwind', 'Modular UI'],
    image: asset('projects/tournify.webp'),
    url: 'https://github.com/LuisNafate/Tournify',
    accent: '#b18cff',
  },
]

const capabilities = [
  ['01', 'Interfaces que se sienten', 'Frontend interactivo, responsive y construido alrededor de una idea visual clara.'],
  ['02', 'Producto de punta a punta', 'Del modelo de datos y la arquitectura hasta la interfaz que utiliza la persona.'],
  ['03', 'Aplicaciones fuera del browser', 'Experiencias móviles y de escritorio con Flutter, Python y APIs nativas.'],
  ['04', 'Curiosidad aplicada', 'Audio, movilidad, entretenimiento, productividad y cualquier problema que merezca explorarse.'],
]

function Loader({ done }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const started = performance.now()
    const tick = (now) => {
      const value = Math.min(100, Math.round(((now - started) / 760) * 100))
      setCount(value)
      if (value < 100) requestAnimationFrame(tick)
      else setTimeout(done, 80)
    }
    requestAnimationFrame(tick)
  }, [done])
  return (
    <div className="loader">
      <div className="loader-mark">LN<span>®</span></div>
      <div className="loader-bottom"><span>Inicializando sistema</span><strong>{String(count).padStart(3, '0')}%</strong></div>
      <div className="loader-line"><i style={{ width: `${count}%` }} /></div>
    </div>
  )
}

function App() {
  const root = useRef()
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showExperience, setShowExperience] = useState(false)

  useEffect(() => {
    if (!loaded || matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 700) return undefined
    const reveal = () => setShowExperience(true)
    const idleId = 'requestIdleCallback' in window
      ? requestIdleCallback(reveal, { timeout: 900 })
      : setTimeout(reveal, 300)
    return () => {
      if ('cancelIdleCallback' in window) cancelIdleCallback(idleId)
      else clearTimeout(idleId)
    }
  }, [loaded])

  useLayoutEffect(() => {
    if (!loaded) return undefined
    const context = gsap.context(() => {
      gsap.from('.hero-line > span', { yPercent: 110, duration: 1.15, stagger: 0.1, ease: 'power4.out', delay: 0.08 })
      gsap.from('.hero-meta, .hero-actions, .hud', { opacity: 0, y: 22, duration: 0.8, stagger: 0.08, delay: 0.45 })
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 70,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        })
      })
      gsap.utils.toArray('.project-card').forEach((card) => {
        const image = card.querySelector('.project-image img')
        gsap.fromTo(image, { scale: 1.12 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
      })
      gsap.to('.progress-bar i', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      })
    }, root)
    return () => context.revert()
  }, [loaded])

  useEffect(() => {
    if (!loaded) return undefined
    const handleMove = (event) => {
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`)
      document.documentElement.style.setProperty('--my', `${event.clientY}px`)
    }
    addEventListener('pointermove', handleMove)
    return () => removeEventListener('pointermove', handleMove)
  }, [loaded])

  if (!loaded) return <Loader done={() => setLoaded(true)} />

  const closeMenu = () => setMenuOpen(false)

  return (
    <main ref={root}>
      {showExperience ? (
        <Suspense fallback={<div className="experience-fallback" />}>
          <Experience />
        </Suspense>
      ) : <div className="experience-fallback" />}
      <div className="noise" />
      <div className="cursor-glow" />
      <div className="progress-bar"><i /></div>

      <header className="site-header">
        <a className="logo" href="#top" aria-label="Inicio">LN<span>®</span></a>
        <div className="availability"><i /> Disponible para nuevas ideas</div>
        <nav className={menuOpen ? 'open' : ''} aria-label="Navegación principal">
          <a href="#work" onClick={closeMenu}>Proyectos</a>
          <a href="#about" onClick={closeMenu}>Perfil</a>
          <a href="#contact" onClick={closeMenu}>Contacto</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hud hud-left"><span>LAT 16.75° N</span><span>LON 93.12° W</span></div>
        <div className="hud hud-right"><span>SYSTEM / 2026</span><span className="online">ONLINE</span></div>
        <div className="hero-copy">
          <p className="hero-meta"><span>Creative developer</span><span>Tuxtla Gutiérrez · MX</span></p>
          <h1>
            <span className="hero-line"><span>CONSTRUYO</span></span>
            <span className="hero-line outline"><span>LO QUE AÚN</span></span>
            <span className="hero-line indent"><span>NO EXISTE.</span></span>
          </h1>
          <div className="hero-actions">
            <p>Software, interfaces y experimentos digitales donde la ingeniería se encuentra con una obsesión por los detalles.</p>
            <a href="#work" className="round-button" aria-label="Ver proyectos"><ArrowDownRight /></a>
          </div>
        </div>
        <div className="scroll-note"><span>Scroll para explorar</span><i /></div>
      </section>

      <section className="manifesto section-shell">
        <div className="section-kicker" data-reveal><span>01</span> Manifiesto</div>
        <div className="manifesto-grid">
          <p className="manifesto-lead" data-reveal>No me interesa hacer<br />otra pantalla más.</p>
          <div className="manifesto-copy" data-reveal>
            <p>Me interesa convertir una necesidad en un sistema que funcione, se sienta natural y tenga una identidad imposible de confundir.</p>
            <p>Trabajo entre frontend, producto y código creativo. Cada proyecto es una oportunidad para aprender una tecnología nueva y llevarla más lejos.</p>
          </div>
        </div>
        <div className="signal" data-reveal><span>IDEA</span><i /><span>PROTOTIPO</span><i /><span>PRODUCTO</span></div>
      </section>

      <section className="work section-shell" id="work">
        <div className="section-heading" data-reveal>
          <div className="section-kicker"><span>02</span> Selected work</div>
          <h2>PROYECTOS<br /><em>EN ÓRBITA</em></h2>
          <p>Una selección de productos reales. Cada portada utiliza capturas y recursos visuales extraídos de su propio repositorio.</p>
        </div>
        <div className="projects">
          {projects.map((project) => (
            <article className="project-card" key={project.title} style={{ '--accent': project.accent }} data-reveal>
              <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Ver ${project.title} en GitHub`}>
                <div className="project-image"><img src={project.image} alt={`Vista de ${project.title}`} width="1600" height="1000" loading="lazy" decoding="async" /><span className="project-number">{project.id}</span><span className="project-status">Repositorio público</span></div>
                <div className="project-info">
                  <div><p>{project.eyebrow}</p><h3>{project.title}</h3></div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-footer"><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="project-arrow"><ArrowUpRight /></span></div>
                </div>
              </a>
            </article>
          ))}
        </div>
        <a className="all-work" href="https://github.com/LuisNafate?tab=repositories" target="_blank" rel="noreferrer" data-reveal><span>Ver todos los repositorios</span><ArrowUpRight /></a>
      </section>

      <section className="capabilities section-shell">
        <div className="section-heading compact" data-reveal>
          <div className="section-kicker"><span>03</span> Capabilities</div>
          <h2>UN PERFIL.<br /><em>MUCHOS SISTEMAS.</em></h2>
        </div>
        <div className="capability-list">
          {capabilities.map(([number, title, description]) => (
            <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{description}</p><i><ArrowUpRight /></i></article>
          ))}
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="about-photo" data-reveal>
          <img src="https://avatars.githubusercontent.com/u/132489185?v=4" alt="Luis Nafate" width="460" height="460" loading="lazy" decoding="async" />
          <div className="scanline" />
          <span>SUBJECT / LN-01</span>
        </div>
        <div className="about-copy" data-reveal>
          <div className="section-kicker"><span>04</span> Sobre mí</div>
          <h2>LUIS<br /><em>NAFATE</em></h2>
          <p className="about-intro">Desarrollador mexicano que aprende construyendo.</p>
          <p>Mi trabajo cruza aplicaciones web, móviles y de escritorio. He explorado análisis de audio, movilidad urbana, productividad, plataformas deportivas y experiencias alrededor de la Fórmula 1.</p>
          <div className="stack"><span>React</span><span>Next.js</span><span>Angular</span><span>Flutter</span><span>Python</span><span>Java</span><span>TypeScript</span><span>Three.js</span></div>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="footer-copy section-shell" data-reveal>
          <div className="section-kicker"><span>05</span> Siguiente misión</div>
          <p>¿TIENES UNA IDEA?</p>
          <h2>HAGAMOS QUE<br /><em>COBRE VIDA.</em></h2>
          <a className="contact-link" href="https://github.com/LuisNafate" target="_blank" rel="noreferrer"><Github /><span>Conversemos en GitHub</span><ArrowUpRight /></a>
        </div>
        <div className="footer-bottom section-shell"><span>© {new Date().getFullYear()} Luis Nafate</span><span>Diseñado para explorar</span><a href="#top">Volver arriba ↑</a></div>
      </footer>
    </main>
  )
}

export default App
