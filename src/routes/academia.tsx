import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Dumbbell, Clock } from "lucide-react";

export const Route = createFileRoute("/academia")({
  head: () => ({
    meta: [
      { title: "Academia — Condomínio das Flores" },
      { name: "description", content: "Espaço fitness completo com equipamentos premium." },
    ],
  }),
  component: AcademiaPage,
});

function AcademiaPage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <BackToMenu />
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="text-center">
          <Dumbbell className="mx-auto h-10 w-10 text-amber-400" />
          <p className="mt-4 text-[11px] tracking-[0.35em] text-amber-300/80">FITNESS</p>
          <h1 className="mt-2 font-serif text-4xl">Academia</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Equipamentos Technogym, sala de musculação, área cardio e crossfit coberto.
          </p>
        </header>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-serif text-2xl">Estrutura</h3>
            <ul className="mt-4 grid gap-2 text-sm text-white/75">
              <li>· Musculação completa</li>
              <li>· Esteiras, bikes e elípticos</li>
              <li>· Espaço funcional</li>
              <li>· Vestiários com sauna</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-serif text-2xl inline-flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" /> Horário
            </h3>
            <p className="mt-4 text-sm text-white/75">Segunda a domingo · 05h às 23h</p>
            <p className="mt-2 text-xs text-white/55">Acesso por biometria.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
