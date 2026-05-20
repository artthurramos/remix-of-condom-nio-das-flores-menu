import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Home, UserRound, Wrench, Check } from "lucide-react";
import { useState } from "react";
import entradaBg from "@/assets/entrada-bg.jpg";


export const Route = createFileRoute("/entrada")({
  component: EntradaPage,
});

type Tipo = "morador" | "visitante" | "prestador";

const opcoes: { id: Tipo; label: string; descricao: string; Icon: typeof Home }[] = [
  {
    id: "morador",
    label: "Morador",
    descricao: "Residente do condomínio com acesso completo.",
    Icon: Home,
  },
  {
    id: "visitante",
    label: "Visitante",
    descricao: "Convidado autorizado por um morador.",
    Icon: UserRound,
  },
  {
    id: "prestador",
    label: "Prestador de Serviço",
    descricao: "Profissional contratado para atendimento.",
    Icon: Wrench,
  },
];

function EntradaPage() {
  const [selecionado, setSelecionado] = useState<Tipo | null>(null);

  return (
    <main className="relative min-h-screen bg-neutral-900 text-white">
      <BackToMenu />
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-[11px] tracking-[0.35em] text-white/60">ACESSO PRINCIPAL</p>
        <h1 className="mt-2 font-serif text-5xl">Entrada</h1>
        <p className="mt-4 max-w-md text-white/75">
          Selecione abaixo qual é o seu perfil para registrar a entrada na portaria.
        </p>

        <div className="mt-12 grid w-full gap-6 sm:grid-cols-3">
          {opcoes.map(({ id, label, descricao, Icon }) => {
            const ativo = selecionado === id;
            return (
              <button
                key={id}
                onClick={() => setSelecionado(id)}
                className={`group relative flex flex-col items-center rounded-2xl border p-8 text-center transition ${
                  ativo
                    ? "border-white bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
                    : "border-white/15 bg-white/5 hover:border-white/40 hover:bg-white/10"
                }`}
              >
                {ativo && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-900">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <Icon className="h-10 w-10 text-white/85" />
                <h2 className="mt-5 font-serif text-2xl">{label}</h2>
                <p className="mt-2 text-sm text-white/65">{descricao}</p>
              </button>
            );
          })}
        </div>

        {selecionado && (
          <div className="mt-10 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm tracking-wide text-white/85">
            Você é{" "}
            <span className="font-serif text-base text-white">
              {opcoes.find((o) => o.id === selecionado)?.label}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
