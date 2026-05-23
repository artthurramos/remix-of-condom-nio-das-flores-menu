import { createFileRoute, Link } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Map, DoorOpen, Accessibility, Building2, Dumbbell, Utensils, PartyPopper, Bike, Baby, Trees, Trophy, Shirt } from "lucide-react";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
});

const sections = [
  { icon: Map, label: "Mapa do Condomínio", desc: "Veja a localização de cada área", to: "/mapa" as const },
  { icon: Building2, label: "Edifícios", desc: "Torres residenciais", to: "/edificios" as const },
  { icon: Trees, label: "Choupanas ao Ar Livre", desc: "Áreas de convivência 1–6", to: "/choupanas" as const },
  { icon: Dumbbell, label: "Academia", desc: "Espaço fitness completo", to: "/academia" as const },
  { icon: Baby, label: "Brinquedoteca", desc: "Diversão para os pequenos", to: "/brinquedoteca" as const },
  { icon: Shirt, label: "Lavanderia", desc: "Serviço self-service", to: "/lavanderia" as const },
  { icon: Bike, label: "Bicicletário", desc: "Estacionamento para bikes", to: "/bicicletario" as const },
  { icon: Utensils, label: "Salão Gourmet", desc: "Eventos íntimos", to: "/salao-gourmet" as const },
  { icon: PartyPopper, label: "Área de Festas", desc: "Celebrações exclusivas", to: "/area-festas" as const },
  { icon: Trophy, label: "Quadras Esportivas", desc: "Quadras 01 e 02", to: "/quadras" as const },
  { icon: DoorOpen, label: "Entrada / Recepção", desc: "Acesso principal", to: "/entrada" as const },
  { icon: Accessibility, label: "Acessibilidade", desc: "Recursos inclusivos", to: "/acessibilidade" as const },
];

function MenuPage() {
  return (
    <main className="relative min-h-screen bg-neutral-50">
      <BackToMenu />
      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.35em] text-neutral-500">NAVEGAÇÃO GERAL</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-neutral-900">Menu Principal</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            Explore todas as áreas e serviços do Condomínio das Flores.
          </p>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ icon: Icon, label, desc, to }) => (
            <Link
              key={label}
              to={to}
              className="group flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900 hover:shadow-md"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-neutral-900 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg text-neutral-900">{label}</h3>
                <p className="mt-1 text-sm text-neutral-600">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
