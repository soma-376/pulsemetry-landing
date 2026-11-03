"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type RefObject, useEffect } from "react";
import { IDLE_USD } from "./data";
import { createHeroCanvas } from "./heroCanvas";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DOT_COUNT = 260;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 마크업은 애니메이션이 끝난 최종 상태로 렌더링한다.
// JS가 늦거나 실패해도 내용이 그대로 보이고, 여기서 시작 상태로 되돌린 뒤 재생한다.
export function useLandingMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = prefersReducedMotion();
      const q = <T extends Element = HTMLElement>(s: string) =>
        root.querySelector<T>(s)!;
      const qa = <T extends Element = HTMLElement>(s: string) =>
        Array.from(root.querySelectorAll<T>(s));
      const E = "power3.out";

      // hero canvas
      let heroP = reduce ? 1 : 0;
      const canvas = createHeroCanvas({
        stage: q("[data-stage]"),
        canvas: q<HTMLCanvasElement>("[data-canvas]"),
        bar: q("[data-bar]"),
        count: DOT_COUNT,
        getProgress: () => heroP,
      });

      // hero
      if (!reduce) {
        gsap.from(qa("[data-hline]"), {
          yPercent: 105,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          delay: 0.15,
        });
        gsap.from(q("[data-eyebrow]"), {
          opacity: 0,
          y: 8,
          duration: 0.8,
          ease: E,
          delay: 0.1,
        });
        gsap.set([q("[data-num]"), q("[data-legend]")], { opacity: 0 });
        const rolls = qa("[data-roll]");
        gsap.set(rolls, { y: 0, yPercent: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q("[data-hero]"),
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
          onUpdate: () => {
            heroP = Math.min(1, tl.progress() / 0.8);
            canvas.wake();
          },
        });
        tl.to(q("[data-hint]"), { opacity: 0, duration: 0.08 }, 0)
          .to(
            q("[data-num]"),
            { opacity: 1, duration: 0.15, ease: "none" },
            0.55,
          )
          .to(
            q("[data-legend]"),
            { opacity: 1, duration: 0.1, ease: "none" },
            0.82,
          )
          .to({}, { duration: 0.1 }, 0.9);
        rolls.forEach((el, i) =>
          tl.to(
            el,
            {
              yPercent: -10 * Number(el.dataset.roll),
              ease: "power2.inOut",
              duration: 0.25,
            },
            0.58 + i * 0.025,
          ),
        );
      } else {
        gsap.set(q("[data-hint]"), { opacity: 0 });
      }

      // section reveals
      if (!reduce) {
        qa("[data-reveal]").forEach((g) => {
          gsap.from(g.querySelectorAll("[data-line]"), {
            yPercent: 105,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
            scrollTrigger: { trigger: g, start: "top 78%", once: true },
          });
        });
      }

      // seats
      const idle = qa("[data-idle]");
      const nEl = q("[data-idle-n]");
      const uEl = q("[data-idle-usd]");
      const setSeat = (k: number) => {
        const n = Math.round(idle.length * k);
        nEl.textContent = String(n);
        uEl.textContent = "$" + Math.round((IDLE_USD * n) / idle.length);
      };
      gsap.set(idle, { opacity: 0 });
      setSeat(0);
      gsap
        .timeline({
          scrollTrigger: {
            trigger: q("[data-seats]"),
            start: "top top",
            end: "bottom bottom",
            scrub: reduce ? true : 0.5,
            onUpdate: (s) =>
              setSeat(Math.min(1, Math.max(0, (s.progress - 0.15) / 0.6))),
          },
        })
        .to(
          idle,
          {
            opacity: 1,
            duration: 0.6,
            ease: "none",
            stagger: { each: 0.6 / idle.length, from: "random" },
          },
          0.15,
        )
        .to({}, { duration: 0.25 });

      // product
      const panels = qa("[data-panel]");
      const steps = qa("[data-step]");
      const ticks = qa("[data-tick]");
      gsap.set([...panels.slice(1), ...steps.slice(1)], { opacity: 0, y: 16 });
      if (!reduce)
        gsap.from(qa("[data-wbar]"), {
          scaleX: 0,
          duration: 1.2,
          ease: E,
          stagger: 0.1,
          scrollTrigger: {
            trigger: q("[data-product]"),
            start: "top 60%",
            once: true,
          },
        });
      const pt = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-product]"),
          start: "top top",
          end: "bottom bottom",
          scrub: reduce ? true : 0.6,
        },
      });
      const D = reduce ? 0.001 : 0.08;
      ticks.forEach((t, i) =>
        pt.to(t, { scaleX: 1, ease: "none", duration: 1 / 3 }, i / 3),
      );
      [1, 2].forEach((i) => {
        const at = i / 3;
        pt.to(
          [panels[i - 1], steps[i - 1]],
          { opacity: 0, y: -16, duration: D, ease: "power2.in" },
          at - D,
        ).to(
          [panels[i], steps[i]],
          { opacity: 1, y: 0, duration: D, ease: "power2.out" },
          at,
        );
      });

      // install
      const cmdEl = q("[data-cmd]");
      const fullCmd = cmdEl.textContent ?? "";
      if (!reduce) {
        const caret = q("[data-caret]");
        const lines = qa("[data-tline]");
        const status = [q("[data-st-ok]"), q("[data-st-meta]")];
        const dot = q("[data-st-dot]");
        const typed = { n: 0 };
        cmdEl.textContent = "";
        gsap.set(lines, { opacity: 0, y: 6 });
        gsap.set(status, { opacity: 0 });
        gsap.set(dot, { backgroundColor: "#8B93A3" });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: q("[data-install]"),
              start: "top 55%",
              once: true,
            },
          })
          .set(caret, { opacity: 1 })
          .to(typed, {
            n: fullCmd.length,
            duration: 1.6,
            ease: "none",
            onUpdate: () => {
              cmdEl.textContent = fullCmd.slice(0, Math.round(typed.n));
            },
          })
          .set(caret, { opacity: 0 }, "+=0.25")
          .to(lines, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.45,
            ease: E,
          })
          .to(dot, { backgroundColor: "#89B48D", duration: 0.3 }, "+=0.2")
          .to(status, { opacity: 1, duration: 0.4, stagger: 0.1 }, "<");
      }

      let alive = true;
      document.fonts?.ready.then(() => {
        if (!alive) return;
        ScrollTrigger.refresh();
        canvas.refresh();
      });
      return () => {
        alive = false;
        canvas.destroy();
        // 타이핑 효과로 지운 명령어를 되돌린다. textContent는 GSAP 리버트 대상이 아니다.
        cmdEl.textContent = fullCmd;
      };
    },
    { scope: rootRef },
  );

  // Lenis 관성 스크롤 · GSAP ticker 한 곳에서 구동해 ScrollTrigger와 프레임을 맞춘다.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);
}
