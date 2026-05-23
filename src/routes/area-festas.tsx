import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { PartyPopper } from "lucide-react";

export const Route = createFileRoute("/area-festas")({
  head: () => ({
    meta: [
      { title: "Área de Festas — Condomínio das Flores" },
      { name: "description", content: "Salão de festas para celebrações exclusivas." },
    ],
  }),
  component: AreaFestasPage,
});

function AreaFestasPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-fuchsia-50 to-amber-50">
      <BackToMenu />
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <PartyPopper className="mx-auto h-10 w-10 text-fuchsia-600" />
        <p className="mt-4 text-[11px] tracking-[0.35em] text-fuchsia-700">CELEBRAÇÕES</p>
        <h1 className="mt-2 font-serif text-4xl text-neutral-900">Área de Festas</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-700">
          Dois salões integráveis, pé-direito duplo e terraço panorâmico.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Capacidade", d: "Até 120 pessoas" },
            { t: "Estrutura", d: "Som, palco e copa" },
            { t: "Terraço", d: "Vista do jardim" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-fuchsia-200/60 bg-white p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-fuchsia-700">{c.t}</p>
              <p className="mt-2 font-serif text-xl text-neutral-900">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
