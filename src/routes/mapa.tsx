import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import mapa from "@/assets/mapa-colorido.png";
import { BackToMenu } from "@/components/BackToMenu";

export const Route = createFileRoute("/mapa")({
  component: MapaPage,
});

// Hotspots positioned in % over the map image (x,y = center, w,h = size of clickable/highlight area)
type Hotspot = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const hotspots: Hotspot[] = [
  { id: "quadra1", name: "Quadra Esportes 01", color: "#3aa66a", x: 35, y: 11, w: 18, h: 12 },
  { id: "quadra2", name: "Quadra Esportes 02", color: "#3aa66a", x: 65, y: 11, w: 18, h: 12 },
  { id: "edif1", name: "Edifícios", color: "#ea7a3b", x: 22, y: 24, w: 22, h: 16 },
  { id: "edif2", name: "Edifícios", color: "#ea7a3b", x: 78, y: 24, w: 22, h: 16 },
  { id: "brinq", name: "Brinquedoteca", color: "#e0b32a", x: 11, y: 30, w: 10, h: 9 },
  { id: "lavand", name: "Lavanderia", color: "#3b82f6", x: 89, y: 30, w: 10, h: 9 },
  { id: "choup1", name: "Choupanas ao Ar Livre", color: "#3aa66a", x: 22, y: 44, w: 22, h: 14 },
  { id: "choup2", name: "Choupanas ao Ar Livre", color: "#3aa66a", x: 78, y: 44, w: 22, h: 14 },
  { id: "academia", name: "Academia", color: "#d94a4a", x: 11, y: 50, w: 10, h: 9 },
  { id: "bicicle", name: "Bicicletário", color: "#d63864", x: 89, y: 50, w: 10, h: 9 },
  { id: "piscina", name: "Piscinas", color: "#0ea5e9", x: 50, y: 45, w: 22, h: 35 },
  { id: "edif3", name: "Edifícios", color: "#ea7a3b", x: 22, y: 72, w: 24, h: 18 },
  { id: "edif4", name: "Edifícios", color: "#ea7a3b", x: 78, y: 72, w: 24, h: 18 },
  { id: "salao", name: "Salão Gourmet", color: "#2e3a8c", x: 27, y: 92, w: 16, h: 10 },
  { id: "festas", name: "Área de Festas", color: "#a23ea8", x: 73, y: 92, w: 16, h: 10 },
  { id: "recepcao", name: "Recepção", color: "#1f2937", x: 50, y: 96, w: 10, h: 8 },
];

function MapaPage() {
  const [active, setActive] = useState<string | null>(null);
  const activeSpot = hotspots.find((h) => h.id === active) ?? null;

  return (
    <main className="relative min-h-screen bg-neutral-100">
      <BackToMenu />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <header className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.35em] text-neutral-500">CONDOMÍNIO DAS FLORES</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-neutral-900">Mapa do Condomínio</h1>
          <p className="mt-2 text-sm text-neutral-500">Clique em uma área do mapa para destacá-la</p>
        </header>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="relative" onClick={() => setActive(null)}>
            <img
              src={mapa}
              alt="Mapa do condomínio"
              className={`block w-full transition-all duration-500 ${
                activeSpot ? "blur-md scale-[1.01] brightness-90" : ""
              }`}
            />

            {hotspots.map((h) => {
              const isActive = active === h.id;
              return (
                <button
                  key={h.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(isActive ? null : h.id);
                  }}
                  className={`absolute rounded-xl transition-all duration-500 ease-out ${
                    isActive
                      ? "z-20 ring-4 backdrop-blur-0 scale-125 shadow-2xl"
                      : activeSpot
                        ? "z-10 opacity-0"
                        : "z-10 hover:ring-2 hover:bg-white/10"
                  }`}
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    width: `${h.w}%`,
                    height: `${h.h}%`,
                    transform: `translate(-50%, -50%) ${isActive ? "scale(1.25)" : ""}`,
                    borderColor: h.color,
                    boxShadow: isActive ? `0 0 0 4px ${h.color}, 0 25px 50px -12px rgba(0,0,0,0.5)` : undefined,
                    backgroundImage: isActive ? `url(${mapa})` : undefined,
                    backgroundSize: `${100 / (h.w / 100)}% ${100 / (h.h / 100)}%`,
                    backgroundPosition: `${(h.x - h.w / 2) / (1 - h.w / 100)}% ${(h.y - h.h / 2) / (1 - h.h / 100)}%`,
                  }}
                  aria-label={h.name}
                />
              );
            })}

            {activeSpot && (
              <div
                className="pointer-events-none absolute z-30 -translate-x-1/2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{
                  left: `${activeSpot.x}%`,
                  top: `${activeSpot.y + activeSpot.h * 0.75}%`,
                  background: activeSpot.color,
                }}
              >
                {activeSpot.name}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
          {[
            ["#ea7a3b", "Edifícios"],
            ["#3aa66a", "Choupanas / Quadras"],
            ["#d94a4a", "Academia"],
            ["#e0b32a", "Brinquedoteca"],
            ["#3b82f6", "Lavanderia"],
            ["#d63864", "Bicicletário"],
            ["#2e3a8c", "Salão Gourmet"],
            ["#a23ea8", "Área de Festas"],
            ["#0ea5e9", "Piscinas"],
            ["#1f2937", "Recepção"],
          ].map(([c, t]) => (
            <div key={t} className="flex items-center gap-3 text-sm text-neutral-700">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: "transparent", boxShadow: `0 0 0 2px ${c}` }}
              />
              {t}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
