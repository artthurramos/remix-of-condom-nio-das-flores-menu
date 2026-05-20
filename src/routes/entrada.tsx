import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { DoorOpen } from "lucide-react";

export const Route = createFileRoute("/entrada")({
  component: EntradaPage,
});

function EntradaPage() {
  return (
    <main className="relative min-h-screen bg-neutral-900 text-white">
      <BackToMenu />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <DoorOpen className="h-12 w-12 text-white/80" />
        <p className="mt-6 text-[11px] tracking-[0.35em] text-white/60">ACESSO PRINCIPAL</p>
        <h1 className="mt-2 font-serif text-5xl">Entrada</h1>
        <p className="mt-4 max-w-md text-white/75">
          Recepção 24 horas. Identifique-se na portaria para acessar o condomínio.
        </p>
      </div>
    </main>
  );
}
