import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BackToMenu } from "@/components/BackToMenu";
import {
  PhoneCall,
  PhoneOff,
  X,
  Building2,
  Dumbbell,
  Puzzle,
  Shirt,
  Bike,
  Flag,
  TreePine,
  UtensilsCrossed,
  Music,
  Bell,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  "BLOCO A": Building2,
  "BLOCO B": Building2,
  "BLOCO C": Building2,
  "BLOCO D": Building2,
  ACADEMIA: Dumbbell,
  BRINQUEDOTECA: Puzzle,
  LAVANDERIA: Shirt,
  BICICLETÁRIO: Bike,
  "QUADRA 1": Flag,
  "QUADRA 2": Flag,
  "CHOUPANAS 1,2,3": TreePine,
  "SALÃO GOURMET": UtensilsCrossed,
  "SALÃO DE FESTA": Music,
  RECEPÇÃO: Bell,
};

export const Route = createFileRoute("/mapa")({
  component: MapaPage,
});

type Spot = { page: number; name: string; cx: number; cy: number };

const SPOTS: Spot[] = [
  { page: 2, name: "BLOCO C", cx: 30.6, cy: 24.8 },
  { page: 3, name: "BLOCO A", cx: 64.4, cy: 75.2 },
  { page: 4, name: "BLOCO D", cx: 71.7, cy: 24.8 },
  { page: 5, name: "BLOCO B", cx: 37.6, cy: 75.5 },
  { page: 6, name: "ACADEMIA", cx: 23.7, cy: 43.5 },
  { page: 7, name: "BRINQUEDOTECA", cx: 25.9, cy: 52.9 },
  { page: 8, name: "LAVANDERIA", cx: 78.2, cy: 43.8 },
  { page: 9, name: "BICICLETÁRIO", cx: 78.1, cy: 53.3 },
  { page: 10, name: "QUADRA 1", cx: 44.4, cy: 15.7 },
  { page: 11, name: "QUADRA 2", cx: 57.4, cy: 15.6 },
  { page: 12, name: "CHOUPANAS 1,2,3", cx: 33.0, cy: 46.4 },
  { page: 13, name: "CHOUPANAS 1,2,3", cx: 69.1, cy: 46.5 },
  { page: 14, name: "SALÃO GOURMET", cx: 33.3, cy: 80.6 },
  { page: 15, name: "SALÃO DE FESTA", cx: 69.8, cy: 86.9 },
  { page: 17, name: "RECEPÇÃO", cx: 53.4, cy: 86.1 },
];

const MASK_W = 480; // downsampled for fast sampling
const MASK_H = 270;

function MapaPage() {
  const [hover, setHover] = useState<Spot | null>(null);
  const [active, setActive] = useState<Spot | null>(null);
  const masksRef = useRef<Map<number, Uint8ClampedArray>>(new Map());
  const [ready, setReady] = useState(false);

  // Preload masks into a small offscreen canvas and store alpha arrays
  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.width = MASK_W;
    canvas.height = MASK_H;
    const ctx = canvas.getContext("2d")!;
    Promise.all(
      SPOTS.map(
        (s) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, MASK_W, MASK_H);
              ctx.drawImage(img, 0, 0, MASK_W, MASK_H);
              const data = ctx.getImageData(0, 0, MASK_W, MASK_H).data;
              // store only alpha-ish: white pixel (R>128) means in-mask
              const buf = new Uint8ClampedArray(MASK_W * MASK_H);
              for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                buf[j] = data[i] > 128 ? 1 : 0;
              }
              masksRef.current.set(s.page, buf);
              res();
            };
            img.onerror = () => res();
            img.src = `/mapa/mask-${s.page}.png`;
          })
      )
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hitTest = (xPct: number, yPct: number): Spot | null => {
    const x = Math.max(0, Math.min(MASK_W - 1, Math.floor((xPct / 100) * MASK_W)));
    const y = Math.max(0, Math.min(MASK_H - 1, Math.floor((yPct / 100) * MASK_H)));
    const idx = y * MASK_W + x;
    for (const s of SPOTS) {
      const m = masksRef.current.get(s.page);
      if (m && m[idx]) return s;
    }
    return null;
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const s = hitTest(x, y);
    setHover(s);
  };

  const [intercom, setIntercom] = useState<
    | { tipo: "bloco"; bloco: string; apto: number }
    | { tipo: "local"; nome: string }
    | null
  >(null);
  const [callState, setCallState] = useState<"idle" | "confirm" | "calling" | "connected">("idle");

  const abrirIntercom = (s: Spot) => {
    const m = s.name.match(/^BLOCO ([ABCD])$/);
    if (m) {
      setIntercom({ tipo: "bloco", bloco: m[1], apto: 0 });
      setCallState("idle");
    } else {
      setIntercom({ tipo: "local", nome: s.name });
      setCallState("calling");
      setTimeout(() => setCallState("connected"), 2000);
    }
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const s = hitTest(x, y);
    setActive(s);
    if (s) abrirIntercom(s);
  };

  const iniciarChamada = (apto: number) => {
    setIntercom((p) => (p && p.tipo === "bloco" ? { ...p, apto } : p));
    setCallState("calling");
    setTimeout(() => setCallState("connected"), 2000);
  };

  const encerrar = () => {
    setCallState("idle");
    setIntercom(null);
  };

  return (
    <main className="relative min-h-screen bg-neutral-100">
      <BackToMenu />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <header className="mb-6 text-center">
          <p className="text-[11px] tracking-[0.35em] text-neutral-500">CONDOMÍNIO DAS FLORES</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-neutral-900">Mapa do Condomínio</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {ready ? "Passe o mouse e clique exatamente sobre um local para destacá-lo" : "Carregando mapa..."}
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <div
            className="relative select-none"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            onClick={onClick}
            style={{ cursor: hover ? "pointer" : "default" }}
          >
            {/* Base map */}
            <img
              src="/mapa/base.jpg"
              alt="Mapa do Condomínio das Flores"
              className="block w-full"
              draggable={false}
            />

            {/* Highlighted page overlay when active */}
            {SPOTS.map((s) => (
              <img
                key={s.page}
                src={`/mapa/page-${s.page}.jpg`}
                alt=""
                aria-hidden
                draggable={false}
                className={`pointer-events-none absolute inset-0 block w-full h-full transition-opacity duration-300 ${
                  active?.page === s.page ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Hover preview (soft highlight via mask image with tint) */}
            {hover && active?.page !== hover.page && (
              <img
                src={`/mapa/mask-${hover.page}.png`}
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute inset-0 block w-full h-full opacity-25 mix-blend-multiply"
                style={{ filter: "invert(1) sepia(1) saturate(6) hue-rotate(-20deg)" }}
              />
            )}

            {/* Floating name on hover (only if not the active one) */}
            {hover && active?.page !== hover.page && (
              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
                style={{ left: `${hover.cx}%`, top: `${hover.cy}%` }}
              >
                {hover.name}
              </div>
            )}
          </div>

          {active && (
            <button
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 z-30 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-md ring-1 ring-black/5 hover:bg-white"
            >
              Limpar seleção
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          {Array.from(new Map(SPOTS.map((s) => [s.name, s])).values()).map((s) => {
            const Icon = ICON_MAP[s.name] || Building2;
            return (
              <button
                key={s.name}
                onClick={() => {
                  setActive(s);
                  abrirIntercom(s);
                }}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  active?.name === s.name
                    ? "border-amber-500 bg-amber-50 font-semibold text-amber-900"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-amber-500" />
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {intercom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={encerrar}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-800 text-white shadow-2xl ring-1 ring-white/10"
          >
            <button
              onClick={encerrar}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-8 pb-4 text-center">
              <p className="text-[11px] tracking-[0.35em] text-white/50">INTERFONE</p>
              <h2 className="mt-2 font-serif text-3xl">
                {intercom.tipo === "bloco" ? `Bloco ${intercom.bloco}` : intercom.nome}
              </h2>
              {intercom.tipo === "bloco" && callState === "idle" && (
                <p className="mt-1 text-sm text-white/60">Selecione o apartamento</p>
              )}
              {callState === "calling" && (
                <p className="mt-1 text-sm text-amber-300">
                  {intercom.tipo === "bloco"
                    ? `Chamando apto ${String(intercom.apto).padStart(2, "0")}...`
                    : "Chamando..."}
                </p>
              )}
              {callState === "connected" && (
                <p className="mt-1 text-sm text-emerald-300">
                  {intercom.tipo === "bloco"
                    ? `Conectado — apto ${String(intercom.apto).padStart(2, "0")}`
                    : "Conectado"}
                </p>
              )}
            </div>

            {intercom.tipo === "bloco" && callState === "idle" ? (
              <div className="px-6 pb-8">
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => iniciarChamada(n)}
                      className="group flex aspect-square flex-col items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:bg-emerald-500/20 hover:ring-emerald-400/50"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-white/50 group-hover:text-emerald-200">
                        Apto
                      </span>
                      <span className="text-lg font-semibold text-white">
                        {intercom.bloco}
                        {String(n).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-white/40">
                  10 apartamentos disponíveis neste bloco
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center px-6 pb-10">
                <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
                  {callState === "calling" && (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
                      <span className="absolute inset-2 animate-pulse rounded-full bg-emerald-500/20" />
                    </>
                  )}
                  <div
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full ${
                      callState === "connected" ? "bg-emerald-500" : "bg-emerald-600"
                    }`}
                  >
                    <PhoneCall className="h-10 w-10 text-white" />
                  </div>
                </div>
                <p className="mb-1 text-2xl font-semibold">
                  {intercom.tipo === "bloco"
                    ? `Apto ${intercom.bloco}${String(intercom.apto).padStart(2, "0")}`
                    : intercom.nome}
                </p>
                <p className="mb-6 text-xs text-white/50">
                  {callState === "calling" ? "Tocando..." : "Chamada em andamento"}
                </p>
                <button
                  onClick={encerrar}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
                >
                  <PhoneOff className="h-4 w-4" />
                  Encerrar chamada
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
