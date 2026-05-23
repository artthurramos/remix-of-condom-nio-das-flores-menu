import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Shirt } from "lucide-react";

export const Route = createFileRoute("/lavanderia")({
  head: () => ({
    meta: [
      { title: "Lavanderia — Condomínio das Flores" },
      { name: "description", content: "Lavanderia self-service 24h." },
    ],
  }),
  component: LavanderiaPage,
});

function LavanderiaPage() {
  return (
    <main className="relative min-h-screen bg-neutral-50">
      <BackToMenu />
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Shirt className="mx-auto h-10 w-10 text-neutral-700" />
        <p className="mt-4 text-[11px] tracking-[0.35em] text-neutral-500">SELF-SERVICE</p>
        <h1 className="mt-2 font-serif text-4xl text-neutral-900">Lavanderia</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
          Máquinas industriais e secadoras com pagamento por aplicativo.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-left">
            <h3 className="font-serif text-xl text-neutral-900">Equipamentos</h3>
            <ul className="mt-3 grid gap-1.5 text-sm text-neutral-600">
              <li>· 4 lavadoras 12kg</li>
              <li>· 4 secadoras 10kg</li>
              <li>· Centrífuga rápida</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-left">
            <h3 className="font-serif text-xl text-neutral-900">Funcionamento</h3>
            <p className="mt-3 text-sm text-neutral-600">Aberta 24 horas, todos os dias.</p>
            <p className="mt-2 text-xs text-neutral-500">Reserva pelo app do morador.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
