import { createFileRoute, Link } from "@tanstack/react-router";
import { Menu, Map, DoorOpen, ScanEye } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const items = [
  { to: "/menu", icon: Menu, label: "Menu", sub: "NAVEGAÇÃO GERAL" },
  { to: "/mapa", icon: Map, label: "Mapa", sub: "LOCALIZAÇÃO" },
  { to: "/entrada", icon: DoorOpen, label: "Entrada", sub: "ACESSO PRINCIPAL" },
  { to: "/acessibilidade", icon: ScanEye, label: "Acessibilidade", sub: "RECURSOS INCLUSIVOS" },
] as const;

function Index() {
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="flex items-center gap-4 text-[11px] tracking-[0.35em] text-white/80">
          <span className="h-px w-10 bg-white/50" />
          RESIDÊNCIA PRIVADA · EST. 1962
          <span className="h-px w-10 bg-white/50" />
        </div>

        <h1 className="mt-6 text-center font-serif text-5xl md:text-7xl tracking-tight">
          Condomínio <em className="italic font-light">das Flores</em>
        </h1>
        <p className="mt-4 max-w-xl text-center text-sm md:text-base text-white/85">
          Bem-vindo ao seu oásis de luxo, jardins e sofisticação.
        </p>

        <div className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
          {items.map(({ to, icon: Icon, label, sub }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-6 py-8 backdrop-blur-md transition hover:bg-white/20"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-serif text-xl">{label}</span>
              <span className="text-[10px] tracking-[0.25em] text-white/70">{sub}</span>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4 text-[10px] tracking-[0.35em] text-white/70">
          <span className="h-px w-12 bg-white/40" />
          ACESSO EXCLUSIVO
          <span className="h-px w-12 bg-white/40" />
        </div>
      </div>
    </main>
  );
}
