import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Utensils } from "lucide-react";

export const Route = createFileRoute("/salao-gourmet")({
  head: () => ({
    meta: [
      { title: "Salão Gourmet — Condomínio das Flores" },
      { name: "description", content: "Espaço refinado para eventos íntimos." },
    ],
  }),
  component: SalaoGourmetPage,
});

function SalaoGourmetPage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <BackToMenu />
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="text-center">
          <Utensils className="mx-auto h-10 w-10 text-amber-300" />
          <p className="mt-4 text-[11px] tracking-[0.35em] text-amber-200/80">EVENTOS ÍNTIMOS</p>
          <h1 className="mt-2 font-serif text-4xl">Salão Gourmet</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Cozinha profissional, adega climatizada e mesa para 16 lugares.
          </p>
        </header>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-serif text-2xl">Estrutura</h3>
            <ul className="mt-4 grid gap-2 text-sm text-white/75">
              <li>· Fogão 6 bocas e forno combinado</li>
              <li>· Adega para 80 garrafas</li>
              <li>· Louças e cristais inclusos</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-serif text-2xl">Reserva</h3>
            <p className="mt-4 text-sm text-white/75">Disponível pelo app do morador.</p>
            <p className="mt-2 text-xs text-white/55">Taxa de limpeza obrigatória.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
