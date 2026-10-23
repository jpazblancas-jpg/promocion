"use client";

import { useEffect, useRef, useState } from "react";
import { Sculpture3D } from "./Sculpture3D";

const projects = [
  { no: "01", field: "MARCA", title: "TOTOK!", desc: "Identidad genuina, campaña y experiencia de marca naturalmente atrevida.", character: "/design/character-brand.svg", video: "/media/card-marca.mp4", embed: "/embedded/totok/index.html#screen=2048:6997" },
  { no: "02", field: "UX/UI", title: "ENERZA", desc: "Experiencia digital de moda inclusiva, personalización y compra móvil.", character: "/design/character-ui.svg", video: "/media/card-ui.mp4", embed: "/embedded/enerza/index.html#/catalog/Hombre" },
  { no: "03", field: "ANIMACION", title: "Big Hero 6", desc: "Del boceto al movimiento: proceso, personajes y animación final.", character: "/design/character-animation.svg", video: "/media/card-animation.mp4", embed: "/embedded/big-hero-6/index.html#proyecto" },
  { no: "04", field: "INTERACTIVO", title: "Umbral", desc: "Una instalación que convierte el movimiento en paisaje.", character: "/design/character-immersion.svg", video: "/media/card-immersion.mp4", pos: "100%" },
];

const info = ["Profesores", "Plan de estudios", "Egresados", "Campo laboral"];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [menu, setMenu] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([
    { role: "bot", text: "¡Hola! Soy Forma. Pregúntame sobre la carrera o los proyectos." },
  ]);
  const [activeCard, setActiveCard] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);
  const [projectTransition, setProjectTransition] = useState(false);
  const [rotation, setRotation] = useState({ x: -8, y: 0 });
  const [travel, setTravel] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const travelRef = useRef(0);
  const completedTurns = Math.floor(travel / 360);
  const model = completedTurns === 0 ? 0 : ((completedTurns - 1) % 10) + 1;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => document.documentElement.style.setProperty("--scroll", `${window.scrollY}px`));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => { removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);

  const move = (x: number, y: number) => {
    if (!dragging.current) return;
    const dx = x - last.current.x;
    last.current = { x, y };
    const nextTravel = travelRef.current + Math.abs(dx) * 1.35;
    travelRef.current = nextTravel;
    setTravel(nextTravel);
    setRotation((r) => ({ ...r, y: r.y + dx * 1.35 }));
  };

  const goHome = () => {
    setAssistantOpen(false);
    setMenu(false);
    setViewing(null);
    setEntered(false);
    requestAnimationFrame(() => scrollTo({ top: 0, behavior: "smooth" }));
  };

  const showInfo = () => {
    setAssistantOpen(false);
    setViewing(null);
    setEntered(true);
    setMenu(true);
    requestAnimationFrame(() => scrollTo({ top: 0, behavior: "smooth" }));
  };

  const assistantReply = (message: string) => {
    const text = message.toLocaleLowerCase("es");
    if (text.includes("proyecto") || text.includes("portafolio")) return "Tenemos cuatro rutas para explorar: MARCA, UX/UI, ANIMACION e INTERACTIVO. Desliza las tarjetas y toca la que quieras conocer.";
    if (text.includes("profesor") || text.includes("docente")) return "El equipo docente combina práctica profesional, investigación y acompañamiento de proyectos. Puedo abrirte la sección de información.";
    if (text.includes("plan") || text.includes("materia")) return "El plan integra estrategia, identidad, interfaces, animación y experiencias interactivas, con proyectos que conectan todas las áreas.";
    if (text.includes("egresad")) return "Nuestros egresados trabajan en estudios, agencias, equipos de producto, animación, cultura y proyectos independientes.";
    if (text.includes("campo") || text.includes("trabaj") || text.includes("laboral")) return "Puedes desarrollarte en branding, UX/UI, dirección de arte, animación, contenido digital y diseño de experiencias.";
    if (text.includes("inicio") || text.includes("regresar")) return "Claro. Usa el botón Inicio de aquí abajo para volver a la escultura interactiva.";
    return "Puedo ayudarte con proyectos, profesores, plan de estudios, egresados o campo laboral. ¿Qué te gustaría descubrir?";
  };

  const sendAssistantMessage = (message: string) => {
    const clean = message.trim();
    if (!clean || assistantTyping) return;
    setAssistantMessages((items) => [...items, { role: "user", text: clean }]);
    setAssistantInput("");
    setAssistantTyping(true);
    window.setTimeout(() => {
      setAssistantMessages((items) => [...items, { role: "bot", text: assistantReply(clean) }]);
      setAssistantTyping(false);
    }, 650);
  };

  const openProject = (index: number) => {
    if (projectTransition) return;
    setAssistantOpen(false);
    setProjectTransition(true);
    window.setTimeout(() => {
      setViewing(index);
      scrollTo({ top: 0 });
    }, 360);
    window.setTimeout(() => setProjectTransition(false), 900);
  };

  const transition = projectTransition ? <div className="world-transition" aria-hidden="true" /> : null;

  const assistant = (
    <div className={`assistant ${assistantOpen ? "open" : ""}`}>
      <div className="assistant-bubble" aria-hidden={!assistantOpen}>
        <header><strong>FORMA AI</strong><small>En línea</small></header>
        <div className="assistant-messages" aria-live="polite">
          {assistantMessages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.text}</p>)}
          {assistantTyping && <p className="bot typing" aria-label="El asistente está escribiendo"><i /><i /><i /></p>}
        </div>
        {assistantMessages.length === 1 && <div className="assistant-prompts">
          {["Ver proyectos", "Plan de estudios", "Campo laboral"].map((prompt) => <button type="button" key={prompt} onClick={() => sendAssistantMessage(prompt)}>{prompt}</button>)}
        </div>}
        <form className="assistant-form" onSubmit={(event) => { event.preventDefault(); sendAssistantMessage(assistantInput); }}>
          <input value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="Escribe tu pregunta…" aria-label="Mensaje para Forma AI" />
          <button type="submit" aria-label="Enviar mensaje" disabled={!assistantInput.trim() || assistantTyping}>↑</button>
        </form>
        <div className="assistant-actions"><button type="button" onClick={showInfo}>Información</button><button type="button" onClick={goHome}>Inicio</button></div>
      </div>
      <button className="assistant-trigger" onClick={() => setAssistantOpen((open) => !open)} aria-expanded={assistantOpen} aria-label={assistantOpen ? "Cerrar asistente" : "Abrir asistente"}>
        <img src="/media/assistant-loop.webp" alt="" />
        <span>{assistantOpen ? "×" : "¡Hola!"}</span>
      </button>
    </div>
  );

  if (!entered) {
    return (
      <main className="intro">
        <header className="intro-head"><span>DISEÑO / PORTAFOLIO</span><span className="year">2026</span></header>
        <section className="intro-copy"><p>Todo cambia<br />cuando lo <em>mueves.</em></p></section>
        <div className="model-stage"
          onPointerDown={(e) => { dragging.current = true; last.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => move(e.clientX, e.clientY)} onPointerUp={() => dragging.current = false} onPointerCancel={() => dragging.current = false}
          role="slider" aria-label={model === 0 ? "Forma inicial: gira para descubrir 10 modelos" : `Modelo 3D ${model} de 10`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={model} tabIndex={0}
          onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const next = travelRef.current + 90; travelRef.current = next; setTravel(next); setRotation(r => ({...r, y: r.y + (e.key === "ArrowRight" ? 90 : -90)})); } }}>
          <div className="orbit orbit-a" /><div className="orbit orbit-b" />
          <Sculpture3D model={model} rotation={rotation.y} />
          <div className="drag-hint"><span>←</span><b>GIRA · CADA VUELTA CAMBIA</b><span>→</span></div>
        </div>
        <button className="enter" onClick={() => setEntered(true)}><span>ENTRAR</span><span className="enter-arrow">→</span></button>
        <footer className="intro-foot"><span>DISEÑO QUE<br />TRANSFORMA</span><span>CDMX<br />MÉXICO</span></footer>
        {assistant}
      </main>
    );
  }

  if (viewing !== null) {
    const project = projects[viewing];
    if (project.embed) {
      return (
        <>
          <main className="embedded-project">
            <iframe src={project.embed} title={`Proyecto completo ${project.title}`} />
            <button className="embedded-back" onClick={() => { setViewing(null); requestAnimationFrame(() => scrollTo({ top: 0 })); }}>← REGRESAR A FORMA</button>
          </main>
          {assistant}
          {transition}
        </>
      );
    }
    return (
      <main className="project-view">
        <nav className="nav project-nav">
          <button className="brand" onClick={() => { setViewing(null); requestAnimationFrame(() => scrollTo({ top: 0 })); }} aria-label="Volver a la app">FORMA<span>•</span></button>
          <span>{project.no} / {project.title}</span>
        </nav>
        <header className="project-view-head"><span>{project.field}</span><h1>{project.title}</h1><p>{project.desc}</p></header>
        <section className="project-placeholder"><div className="project-placeholder-image" /><p>Instalación interactiva · movimiento · paisaje digital</p></section>
        <footer className="project-return"><button onClick={() => { setViewing(null); requestAnimationFrame(() => scrollTo({ top: 0, behavior: "smooth" })); }}>← REGRESAR A LA APP</button></footer>
        {assistant}
        {transition}
      </main>
    );
  }

  return (
    <main className="home">
      <div className="parallax-decor" aria-hidden="true"><i className="para-flower">✱</i><i className="para-loop">↝</i><i className="para-spark">✦</i></div>
      <nav className="nav"><button className="brand" onClick={() => setEntered(false)} aria-label="Volver a la experiencia inicial">FORMA<span>•</span></button><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Abrir menú"><i /><i /></button></nav>
      <button className={`menu-backdrop ${menu ? "visible" : ""}`} onClick={() => setMenu(false)} aria-label="Cerrar menú" tabIndex={menu ? 0 : -1} />
      <aside className={`drawer ${menu ? "visible" : ""}`} aria-hidden={!menu}>
        <button className="drawer-close" onClick={() => setMenu(false)}>Cerrar ×</button><p>CONOCE LA CARRERA</p>
        {info.map((item, i) => <button key={item} onClick={() => setMenu(false)}><span>0{i + 1}</span>{item}<b>↗</b></button>)}
        <small>Formamos diseñadores que observan,<br />cuestionan y transforman su entorno.</small>
      </aside>
      <section className="hero"><p className="eyebrow">PORTAFOLIO ESTUDIANTIL / 2026</p><h1><small>¡Bienvenidx a</small>Diseño Gráfico<br /><span>en La Salle!</span></h1><div className="video-placeholder"><video controls playsInline preload="metadata" poster="/design/og-video.svg"><source src="/media/master-reel.mp4" type="video/mp4" />Tu navegador no puede reproducir este video.</video></div><div className="hero-bottom"><p>Explora la galería de los mejores proyectos <b>diseñados por nuestros alumnos.</b></p></div></section>
      <section className="projects" onScroll={(event) => { const list = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(".project")); const center = event.currentTarget.scrollLeft + event.currentTarget.clientWidth / 2; let nearest = 0; let distance = Infinity; list.forEach((item, index) => { const next = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center); if (next < distance) { distance = next; nearest = index; } }); setActiveCard(nearest); }}><div className="section-title"><span>ESTUDIA CON NOSOTROS</span><b>04</b></div>
        {projects.map((p, index) => {
          const card = <><div className={`project-character og-character ${p.video ? "has-video" : ""}`} aria-hidden="true">{p.video ? <video src={p.video} autoPlay muted loop playsInline preload="metadata" /> : <img src={p.character} alt="" />}</div><div className="project-card-head"><span>{p.no}</span><b>↗</b></div><strong className="project-category">{p.field}</strong><div className="project-meta"><div><p>{p.title}</p><small>{p.desc}</small></div></div></>;
          return <article className={`project ${activeCard === index ? "active" : ""}`} key={p.title}><button className="project-link" onClick={() => openProject(index)} aria-label={`Abrir proyecto ${p.title} dentro de la app`}>{card}</button></article>;
        })}
        <p className="swipe-hint"><span>←</span> DESLIZA PARA EXPLORAR <span>→</span></p>
      </section>
      <footer className="footer"><div className="footer-mark">F<span>•</span></div><p>LICENCIATURA EN DISEÑO<br />CREATIVIDAD CON PROPÓSITO.</p><img className="lasalle-logo" src="/design/lasalle-logo.png" alt="Universidad La Salle México" /><button onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>VOLVER ARRIBA ↑</button></footer>
      {assistant}
      {transition}
    </main>
  );
}
