import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Accessibility } from "lucide-react";

export const Route = createFileRoute("/acessibilidade")({
  component: AcessPage,
});

function AcessPage() {
  return (
    <main className="relative min-h-screen bg-neutral-50">
      <BackToMenu />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <Accessibility className="h-12 w-12 text-neutral-700" />
        <p className="mt-6 text-[11px] tracking-[0.35em] text-neutral-500">RECURSOS INCLUSIVOS</p>
        <h1 className="mt-2 font-serif text-5xl text-neutral-900">Acessibilidade</h1>
        <p className="mt-4 max-w-md text-neutral-600">
          Rampas, elevadores e sinalização tátil em todas as áreas comuns do condomínio.
        </p>
      </div>
    </main>
  );
}
