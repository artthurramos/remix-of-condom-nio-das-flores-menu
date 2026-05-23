import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Baby } from "lucide-react";

export const Route = createFileRoute("/brinquedoteca")({
  head: () => ({
    meta: [
      { title: "Brinquedoteca — Condomínio das Flores" },
      { name: "description", content: "Espaço lúdico monitorado para crianças." },
    ],
  }),
  component: BrinquedotecaPage,
});

function BrinquedotecaPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      <BackToMenu />
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Baby className="mx-auto h-10 w-10 text-rose-600" />
        <p className="mt-4 text-[11px] tracking-[0.35em] text-rose-600">DIVERSÃO INFANTIL</p>
        <h1 className="mt-2 font-serif text-4xl text-neutral-900">Brinquedoteca</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-700">
          Ambiente climatizado, monitorado e equipado com brinquedos pedagógicos.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Faixa etária", d: "2 a 10 anos" },
            { t: "Monitoria", d: "Diária 09h–18h" },
            { t: "Capacidade", d: "Até 20 crianças" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-rose-200/70 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-rose-600">{c.t}</p>
              <p className="mt-2 font-serif text-xl text-neutral-900">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
