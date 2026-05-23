import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/edificios")({
  head: () => ({
    meta: [
      { title: "Edifícios — Condomínio das Flores" },
      { name: "description", content: "Torres residenciais do Condomínio das Flores." },
    ],
  }),
  component: EdificiosPage,
});

function EdificiosPage() {
  const torres = [
    { nome: "Torre Jasmim", andares: 18, aptos: 72 },
    { nome: "Torre Orquídea", andares: 20, aptos: 80 },
    { nome: "Torre Camélia", andares: 16, aptos: 64 },
    { nome: "Torre Magnólia", andares: 22, aptos: 88 },
  ];
  return (
    <main className="relative min-h-screen bg-neutral-50">
      <BackToMenu />
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="text-center">
          <Building2 className="mx-auto h-10 w-10 text-neutral-700" />
          <p className="mt-4 text-[11px] tracking-[0.35em] text-neutral-500">RESIDENCIAL</p>
          <h1 className="mt-2 font-serif text-4xl text-neutral-900">Edifícios</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            Quatro torres com arquitetura contemporânea e vista privilegiada.
          </p>
        </header>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {torres.map((t) => (
            <div key={t.nome} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-serif text-2xl text-neutral-900">{t.nome}</h3>
              <p className="mt-3 text-sm text-neutral-600">
                {t.andares} andares · {t.aptos} apartamentos
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
