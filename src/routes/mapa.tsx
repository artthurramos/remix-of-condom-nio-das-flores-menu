import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BackToMenu } from "@/components/BackToMenu";

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

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const s = hitTest(x, y);
    setActive(s);
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
              draggable={false}
              className={`block w-full transition-all duration-300 ${
                active ? "blur-md brightness-90" : ""
              }`}
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

            {/* Active spot name */}
            {active && (
              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                style={{ left: `${active.cx}%`, top: `${active.cy}%` }}
              >
                {active.name}
              </div>
            )}

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
          {Array.from(new Map(SPOTS.map((s) => [s.name, s])).values()).map((s) => (
            <button
              key={s.name}
              onClick={() => setActive(s)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                active?.name === s.name
                  ? "border-amber-500 bg-amber-50 font-semibold text-amber-900"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
