"use client";

import { useEffect, useRef } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { bookingAnchor } from "@/config/navigation";
import { requestService } from "@/lib/booking/events";
import { MOTION, gsap, revealOnFocus, ScrollTrigger, useGSAP, type MotionConditions } from "@/lib/motion";
import type { ToolsLayout, ToolsScene as Scene } from "./toolsRenderer";
import { TOOL_WINDOWS } from "./toolWindows";


const steps = [
  {
    tool: "Forbici",
    service: "Taglio",
    serviceId: "taglio",
    text: "Linee costruite sulla forma del viso e sul modo in cui porti i capelli ogni giorno.",
  },
  {
    tool: "Rasoio",
    service: "Barba",
    serviceId: "barba",
    text: "Rifinitura a mano libera: contorni puliti e proporzioni pensate insieme al taglio.",
  },
  {
    tool: "Pettine",
    service: "Piega e styling",
    serviceId: "styling",
    text: "Piega e finish per la giornata o per un'occasione, con prodotti scelti per i tuoi capelli.",
  },
];

/** Indice dello strumento al centro del proprio gesto per un dato progresso. */
function activeIndex(p: number) {
  const centers = TOOL_WINDOWS.map(([a, b]) => (a + b) / 2);
  let best = 0;
  centers.forEach((c, i) => {
    if (Math.abs(p - c) < Math.abs(p - centers[best])) best = i;
  });
  return best;
}

/**
 * Scena 2, "Il mestiere": forbici, rasoio e pettine in 3D. Lo scorrimento
 * (scena fissata) fa entrare uno strumento alla volta e ne guida il gesto;
 * il testo accanto collega ogni strumento al servizio prenotabile.
 * Senza movimento o senza WebGL i tre passaggi restano un elenco statico.
 */
export function ToolsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const progressRef = useRef(0);
  const layoutRef = useRef<ToolsLayout>("static");

  // Carica three.js solo quando la sezione si avvicina al viewport.
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    let disposed = false;
    let visible = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!sceneRef.current) {
          if (visible) load();
          return;
        }
        if (visible) sceneRef.current.start();
        else sceneRef.current.stop();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(section);

    let loading = false;
    async function load() {
      if (loading) return;
      loading = true;
      try {
        const { createToolsScene } = await import("./toolsRenderer");
        if (disposed || !canvas) return;
        const scene = createToolsScene(canvas, layoutRef.current);
        sceneRef.current = scene;
        scene.setProgress(progressRef.current);
        section?.classList.add("has-webgl");
        if (visible) scene.start();
      } catch {
        // WebGL non disponibile: resta il testo, senza strumenti.
        section?.classList.add("no-webgl");
      }
    }

    return () => {
      disposed = true;
      io.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        const { wide, reduce } = ctx.conditions as MotionConditions;
        const section = sectionRef.current!;
        const stage = stageRef.current!;
        const items = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));

        const setLayout = (layout: ToolsLayout) => {
          layoutRef.current = layout;
          sceneRef.current?.setLayout(layout);
        };

        if (reduce) {
          setLayout("static");
          return;
        }

        setLayout(wide ? "wide" : "narrow");
        section.classList.add("is-scrub");

        const apply = (p: number) => {
          progressRef.current = p;
          sceneRef.current?.setProgress(p);
          const active = activeIndex(p);
          items.forEach((el, i) => el.toggleAttribute("data-active", i === active));
          if (barRef.current) barRef.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
        };
        apply(0);

        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: wide ? "+=280%" : "+=200%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => apply(self.progress),
        });

        // Focus da tastiera su un passaggio non visibile: scorri fino al suo gesto.
        const offFocus = revealOnFocus(section, (el) => {
          const step = el.closest<HTMLElement>("[data-step]");
          if (!step) return;
          const i = Number(step.dataset.step);
          const [a, b] = TOOL_WINDOWS[i];
          const p = Math.min(Math.max((a + b) / 2, 0), 1);
          window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: "auto" });
        });

        return () => {
          offFocus();
          section.classList.remove("is-scrub");
          items.forEach((el) => el.removeAttribute("data-active"));
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="mestiere" aria-labelledby="mestiere-title" className="tools">
      <div ref={stageRef} className="tools-stage">
        <canvas ref={canvasRef} className="tools-canvas" aria-hidden="true" />

        <div className="tools-copy mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
          <div className="tools-head">
            <h2 id="mestiere-title" className="type-h2" data-reveal>
              Il mestiere
            </h2>
            <p className="mt-4 max-w-[24rem] text-muted" data-reveal>
              Tre strumenti, un servizio ciascuno.
            </p>
          </div>

          <ol className="tools-steps">
            {steps.map((step, i) => (
              <li key={step.tool} data-step={i} className="tools-step">
                <p className="flex items-baseline gap-3">
                  <span className="type-figure text-[1.5rem] text-red" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="type-label">{step.tool}</span>
                </p>
                <h3 className="type-display mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)]">{step.service}</h3>
                <p className="mt-4 max-w-[28rem] text-muted">{step.text}</p>
                <a
                  href={bookingAnchor}
                  onClick={() => requestService(step.serviceId, true)}
                  className="link mt-5 inline-flex min-h-11 items-center gap-1.5 font-semibold"
                >
                  Prenota<span className="sr-only"> {step.service.toLowerCase()}</span>
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>

          <div className="tools-progress" aria-hidden="true">
            <span ref={barRef} className="tools-progress-bar pole-band" />
          </div>
        </div>
      </div>
    </section>
  );
}
