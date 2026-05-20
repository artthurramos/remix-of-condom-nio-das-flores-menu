import { createFileRoute } from "@tanstack/react-router";
import mapa from "@/assets/mapa.png";
import { BackToMenu } from "@/components/BackToMenu";

export const Route = createFileRoute("/mapa")({
  component: MapaPage,
});

// Labels positioned in % over the map image
type Label = { x: number; y: number; text: string; color: string; align?: "left" | "right" };

const labels: Label[] = [
  { x: 30, y: 2, text: "QUADRA ESPORTES 01", color: "#1f2937", align: "right" },
  { x: 58, y: 2, text: "QUADRA ESPORTES 02", color: "#1f2937", align: "left" },
  { x: 22, y: 18, text: "EDIFÍCIOS", color: "#ea7a3b", align: "right" },
  { x: 70, y: 18, text: "EDIFÍCIOS", color: "#ea7a3b", align: "left" },
  { x: 22, y: 35, text: "CHOUPANAS AO AR LIVRE", color: "#3aa66a", align: "right" },
  { x: 70, y: 35, text: "CHOUPANAS AO AR LIVRE", color: "#3aa66a", align: "left" },
  { x: 12, y: 28, text: "ACADEMIA", color: "#d94a4a", align: "right" },
  { x: 80, y: 28, text: "LAVANDERIA", color: "#3b82f6", align: "left" },
  { x: 12, y: 38, text: "BRINQUEDOTECA", color: "#e0b32a", align: "right" },
  { x: 80, y: 38, text: "BICICLETÁRIO", color: "#d63864", align: "left" },
  { x: 22, y: 65, text: "EDIFÍCIOS", color: "#ea7a3b", align: "right" },
  { x: 70, y: 65, text: "EDIFÍCIOS", color: "#ea7a3b", align: "left" },
  { x: 12, y: 82, text: "SALÃO GOURMET", color: "#2e3a8c", align: "right" },
  { x: 80, y: 82, text: "ÁREA DE FESTAS", color: "#a23ea8", align: "left" },
  { x: 45, y: 95, text: "RECEPÇÃO", color: "#1f2937", align: "right" },
];

function MapaPage() {
  return (
    <main className="relative min-h-screen bg-neutral-100">
      <BackToMenu />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <header className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.35em] text-neutral-500">CONDOMÍNIO DAS FLORES</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-neutral-900">Mapa do Condomínio</h1>
        </header>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="relative">
            <img src={mapa} alt="Mapa do condomínio" className="block w-full" />
            {labels.map((l, i) => (
              <div
                key={i}
                className="absolute flex items-center gap-2"
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  transform: "translate(-50%, -50%)",
                  flexDirection: l.align === "left" ? "row-reverse" : "row",
                }}
              >
                <span
                  className="inline-block h-3 w-3 rounded-full ring-2"
                  style={{ background: "transparent", borderColor: l.color, boxShadow: `0 0 0 2px ${l.color}` }}
                />
                <span
                  className="whitespace-nowrap rounded bg-white/95 px-2 py-1 text-[10px] md:text-xs font-semibold tracking-wider shadow-sm"
                  style={{ color: l.color }}
                >
                  {l.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
          {[
            ["#ea7a3b", "Edifícios"],
            ["#3aa66a", "Choupanas ao Ar Livre (1–6)"],
            ["#d94a4a", "Academia"],
            ["#e0b32a", "Brinquedoteca"],
            ["#3b82f6", "Lavanderia"],
            ["#d63864", "Bicicletário"],
            ["#2e3a8c", "Salão Gourmet"],
            ["#a23ea8", "Área de Festas"],
            ["#1f2937", "Recepção"],
            ["#1f2937", "Quadras Esportivas"],
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
