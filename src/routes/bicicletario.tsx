import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Bike } from "lucide-react";

export const Route = createFileRoute("/bicicletario")({
  head: () => ({
    meta: [
      { title: "Bicicletário — Condomínio das Flores" },
      { name: "description", content: "Estacionamento coberto para bicicletas." },
    ],
  }),
  component: BicicletarioPage,
});

function BicicletarioPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-sky-50 to-neutral-50">
      <BackToMenu />
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Bike className="mx-auto h-10 w-10 text-sky-700" />
        <p className="mt-4 text-[11px] tracking-[0.35em] text-sky-700">MOBILIDADE</p>
        <h1 className="mt-2 font-serif text-4xl text-neutral-900">Bicicletário</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
          Estrutura coberta com 120 vagas, monitorada por câmeras 24h.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Vagas", d: "120" },
            { t: "Acesso", d: "Tag individual" },
            { t: "Extra", d: "Bomba e oficina rápida" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-sky-200/60 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-700">{c.t}</p>
              <p className="mt-2 font-serif text-xl text-neutral-900">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
