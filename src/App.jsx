import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Menu, X } from 'lucide-react'
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

const experience = [
  {
    period: 'ENE 2026 — ACTUAL',
    title: 'RESET',
    role: 'UI/UX Designer · Frontend Developer',
    description: 'Producto web y móvil para registrar avances, visualizar progreso y acompañar procesos de abstinencia mediante una interfaz responsiva.',
    stack: 'Next.js · TypeScript · PostgreSQL · Prisma · Docker',
    url: 'https://github.com/LuisNafate/reset-frontend',
  },
  {
    period: 'AGO — DIC 2025',
    title: 'AUTOSYNC',
    role: 'UI/UX Designer · Frontend Developer',
    description: 'Aplicación Android para administrar mantenimientos, reparaciones y gastos de vehículos, con notificaciones y almacenamiento en la nube.',
    stack: 'Kotlin · Firebase · Android SDK · Figma',
    url: 'https://github.com/LuisNafate/Autosync-APP',
  },
  {
    period: 'MAR — AGO 2025',
    title: 'WHEELY',
    role: 'Frontend Developer · Integraciones API · QA',
    description: 'Plataforma para consultar rutas de transporte público en Tuxtla Gutiérrez, desplegada sobre infraestructura AWS EC2.',
    stack: 'JavaScript · REST APIs · AWS EC2 · Accessibility',
    url: 'https://github.com/LuisNafate/Wheely',
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

      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.utils.toArray('.section-heading h2, .about-copy h2, .footer-copy h2').forEach((title) => {
          gsap.fromTo(title, { yPercent: 10, rotate: 1.2 }, {
            yPercent: -4,
            rotate: 0,
            ease: 'none',
            scrollTrigger: { trigger: title, start: 'top bottom', end: 'bottom top', scrub: 1 },
          })
        })
      }
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
          <a href="#experience" onClick={closeMenu}>Trayectoria</a>
          <a href="#about" onClick={closeMenu}>Perfil</a>
          <a href="#contact" onClick={closeMenu}>Contacto</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hud hud-left"><span>LAT 16.75° N</span><span>LON 93.12° W</span></div>
        <div className="hud hud-right"><span>SYSTEM / 2026</span><span className="online">ONLINE</span></div>
        <div className="hero-copy">
          <p className="hero-meta"><span>Frontend · UI/UX · Product</span><span>Tuxtla Gutiérrez · MX</span></p>
          <h1>
            <span className="hero-line"><span>CONSTRUYO</span></span>
            <span className="hero-line outline"><span>LO QUE AÚN</span></span>
            <span className="hero-line indent"><span>NO EXISTE.</span></span>
          </h1>
          <div className="hero-actions">
            <p>Desarrollo productos web y móviles con React, Next.js y Kotlin, combinando ingeniería, UI/UX y una obsesión por los detalles.</p>
            <a href="#work" className="round-button" aria-label="Ver proyectos"><ArrowDownRight /></a>
          </div>
        </div>
        <nav className="innovation-nav" aria-label="Navegación por misiones">
          <a href="#velocity"><span>01</span><div><strong>MONOPLAZA</strong><small>Producto · velocidad</small></div><i /></a>
          <a href="#launch"><span>02</span><div><strong>COHETE</strong><small>Sistemas · impulso</small></div><i /></a>
          <a href="#flight"><span>03</span><div><strong>AVIÓN</strong><small>Diseño · dirección</small></div><i /></a>
        </nav>
        <div className="scroll-note"><span>Scroll para explorar</span><i /></div>
      </section>

      <section className="vehicle-journey" aria-label="Viaje por mis capacidades">
        <article className="journey-step" id="velocity">
          <div className="journey-copy">
            <span>01 / VELOCIDAD</span>
            <h2>DE LA IDEA<br />AL PROTOTIPO.</h2>
            <p>Itero rápido sin perder precisión: producto, interfaz y código avanzan en la misma dirección.</p>
          </div>
        </article>
        <article className="journey-step journey-step-right" id="launch">
          <div className="journey-copy">
            <span>02 / IMPULSO</span>
            <h2>SISTEMAS LISTOS<br />PARA CRECER.</h2>
            <p>Arquitectura, integraciones y despliegue pensados como partes de una sola misión.</p>
          </div>
        </article>
        <article className="journey-step" id="flight">
          <div className="journey-copy">
            <span>03 / DIRECCIÓN</span>
            <h2>DISEÑO CON<br />UNA RAZÓN.</h2>
            <p>Cada interacción guía, informa y deja espacio para que el producto sea el protagonista.</p>
          </div>
        </article>
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

      <section className="career section-shell" id="experience">
        <div className="section-heading" data-reveal>
          <div className="section-kicker"><span>03</span> Trayectoria</div>
          <h2>EXPERIENCIA<br /><em>APLICADA.</em></h2>
          <p>Proyectos con responsabilidades concretas: diseño de producto, implementación frontend, integraciones, pruebas y despliegue.</p>
        </div>
        <div className="career-layout">
          <div className="experience-list">
            {experience.map((item) => (
              <a href={item.url} target="_blank" rel="noreferrer" key={item.title} data-reveal>
                <span className="experience-period">{item.period}</span>
                <div>
                  <p>{item.role}</p>
                  <h3>{item.title}</h3>
                  <p className="experience-description">{item.description}</p>
                  <span className="experience-stack">{item.stack}</span>
                </div>
                <ArrowUpRight />
              </a>
            ))}
          </div>
          <aside className="credentials" data-reveal>
            <div>
              <span>FORMACIÓN</span>
              <h3>Ingeniería en Tecnologías de la Información e Innovación Digital</h3>
              <p>Universidad Politécnica de Chiapas · 5.º semestre</p>
              <small>Agosto 2024 — presente</small>
            </div>
            <div>
              <span>CERTIFICACIONES</span>
              <h3>AWS Academy Cloud Foundations</h3>
              <p>Amazon Web Services · Abril 2025</p>
              <h3>Professional Java</h3>
              <p>Código Facilito · Junio 2025</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="capabilities section-shell">
        <div className="section-heading compact" data-reveal>
          <div className="section-kicker"><span>04</span> Capabilities</div>
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
          <div className="section-kicker"><span>05</span> Sobre mí</div>
          <h2>LUIS<br /><em>NAFATE</em></h2>
          <p className="about-intro">Frontend developer y diseñador UI/UX que aprende construyendo productos reales.</p>
          <p>Estudio Ingeniería en Tecnologías de la Información e Innovación Digital. Trabajo entre diseño, frontend y producto: desde entender requisitos y prototipar en Figma hasta integrar APIs, probar y desplegar experiencias web y móviles.</p>
          <div className="stack"><span>React</span><span>Next.js</span><span>TypeScript</span><span>Node.js</span><span>PostgreSQL</span><span>Prisma</span><span>Kotlin</span><span>Firebase</span><span>Docker</span><span>AWS</span><span>Figma</span></div>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="footer-copy section-shell" data-reveal>
          <div className="section-kicker"><span>06</span> Siguiente misión</div>
          <p>¿TIENES UNA IDEA?</p>
          <h2>HAGAMOS QUE<br /><em>COBRE VIDA.</em></h2>
          <div className="contact-links">
            <a className="contact-link" href="mailto:luisnafate51@gmail.com"><Mail /><span>luisnafate51@gmail.com</span><ArrowUpRight /></a>
            <a className="contact-link" href="https://linkedin.com/in/luis-nafate" target="_blank" rel="noreferrer"><Linkedin /><span>LinkedIn</span><ArrowUpRight /></a>
            <a className="contact-link" href="https://github.com/LuisNafate" target="_blank" rel="noreferrer"><Github /><span>GitHub</span><ArrowUpRight /></a>
          </div>
        </div>
        <div className="footer-bottom section-shell"><span>© {new Date().getFullYear()} Luis Nafate</span><span>Diseñado para explorar</span><a href="#top">Volver arriba ↑</a></div>
      </footer>
    </main>
  )
}

export default App
