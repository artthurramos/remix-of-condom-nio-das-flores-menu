import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/quadras")({
  head: () => ({
    meta: [
      { title: "Quadras Esportivas — Condomínio das Flores" },
      { name: "description", content: "Quadras 01 e 02 para esportes diversos." },
    ],
  }),
  component: QuadrasPage,
});

function QuadrasPage() {
  const quadras = [
    { n: "01", tipo: "Poliesportiva", desc: "Futsal, basquete e vôlei. Piso emborrachado." },
    { n: "02", tipo: "Tênis / Beach Tennis", desc: "Saibro e areia, iluminação LED noturna." },
  ];
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-lime-50 to-neutral-50">
      <BackToMenu />
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="text-center">
          <Trophy className="mx-auto h-10 w-10 text-lime-700" />
          <p className="mt-4 text-[11px] tracking-[0.35em] text-lime-700">ESPORTE</p>
          <h1 className="mt-2 font-serif text-4xl text-neutral-900">Quadras Esportivas</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            Duas quadras com reserva pelo app, abertas das 06h às 22h.
          </p>
        </header>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {quadras.map((q) => (
            <div key={q.n} className="rounded-2xl border border-lime-200/70 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-lime-700">Quadra {q.n}</p>
              <h3 className="mt-2 font-serif text-2xl text-neutral-900">{q.tipo}</h3>
              <p className="mt-3 text-sm text-neutral-600">{q.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
