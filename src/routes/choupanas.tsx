import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Trees } from "lucide-react";

export const Route = createFileRoute("/choupanas")({
  head: () => ({
    meta: [
      { title: "Choupanas ao Ar Livre — Condomínio das Flores" },
      { name: "description", content: "Áreas de convivência ao ar livre 1 a 6." },
    ],
  }),
  component: ChoupanasPage,
});

function ChoupanasPage() {
  const lista = Array.from({ length: 6 }, (_, i) => ({
    n: i + 1,
    desc:
      i % 2 === 0
        ? "Mesa para 8 pessoas · churrasqueira · pia"
        : "Mesa para 6 pessoas · forno de pizza · pia",
  }));
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-emerald-50 to-neutral-50">
      <BackToMenu />
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="text-center">
          <Trees className="mx-auto h-10 w-10 text-emerald-700" />
          <p className="mt-4 text-[11px] tracking-[0.35em] text-emerald-700">CONVIVÊNCIA</p>
          <h1 className="mt-2 font-serif text-4xl text-neutral-900">Choupanas ao Ar Livre</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            Seis espaços reservados, cercados pelo jardim, para reuniões íntimas.
          </p>
        </header>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((c) => (
            <div key={c.n} className="rounded-2xl border border-emerald-200/60 bg-white p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-serif text-white">
                {c.n}
              </span>
              <h3 className="mt-4 font-serif text-xl text-neutral-900">Choupana {c.n}</h3>
              <p className="mt-2 text-sm text-neutral-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
