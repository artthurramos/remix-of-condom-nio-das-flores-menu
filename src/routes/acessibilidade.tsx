import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import { Accessibility, Bell, Mic, MicOff, PhoneCall, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/acessibilidade")({
  component: AcessPage,
});

type Aba = "menu" | "porteiro" | "voz";

function AcessPage() {
  const [aba, setAba] = useState<Aba>("menu");

  return (
    <main className="relative min-h-screen bg-neutral-50">
      <BackToMenu />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <Accessibility className="h-12 w-12 text-neutral-700" aria-hidden="true" />
        <p className="mt-6 text-[11px] tracking-[0.35em] text-neutral-500">RECURSOS INCLUSIVOS</p>
        <h1 className="mt-2 font-serif text-5xl text-neutral-900">Acessibilidade</h1>
        <p className="mt-4 max-w-md text-neutral-600">
          Ferramentas para auxiliar moradores e visitantes com deficiência visual ou mobilidade reduzida.
        </p>

        {aba === "menu" && (
          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
            <button
              onClick={() => setAba("porteiro")}
              className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-8 text-left transition hover:border-neutral-900 hover:shadow-md"
              aria-label="Chamar o porteiro para auxílio"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-neutral-900 text-white">
                <Bell className="h-6 w-6" />
              </span>
              <h2 className="font-serif text-xl text-neutral-900">Chamar Porteiro</h2>
              <p className="text-sm text-neutral-600">Solicite auxílio presencial imediato na recepção.</p>
            </button>

            <button
              onClick={() => setAba("voz")}
              className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-8 text-left transition hover:border-neutral-900 hover:shadow-md"
              aria-label="Ativar navegação por comando de voz"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-neutral-900 text-white">
                <Mic className="h-6 w-6" />
              </span>
              <h2 className="font-serif text-xl text-neutral-900">Comando de Voz</h2>
              <p className="text-sm text-neutral-600">
                Navegue pelo aplicativo por voz — apoio para baixa visão ou cegueira.
              </p>
            </button>
          </div>
        )}

        {aba === "porteiro" && <Porteiro voltar={() => setAba("menu")} />}
        {aba === "voz" && <Voz voltar={() => setAba("menu")} />}
      </div>
    </main>
  );
}

function Porteiro({ voltar }: { voltar: () => void }) {
  const [estado, setEstado] = useState<"idle" | "chamando" | "atendido">("idle");

  const chamar = () => {
    setEstado("chamando");
    setTimeout(() => setEstado("atendido"), 2500);
  };

  return (
    <div className="mt-10 w-full rounded-xl border border-neutral-200 bg-white p-8">
      <div className="flex flex-col items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-neutral-900 text-white">
          <PhoneCall className={`h-7 w-7 ${estado === "chamando" ? "animate-pulse" : ""}`} />
        </span>
        <h2 className="font-serif text-2xl text-neutral-900">Chamar Porteiro</h2>

        {estado === "idle" && (
          <>
            <p className="text-sm text-neutral-600">
              Ao confirmar, o porteiro será notificado e virá até você.
            </p>
            <button
              onClick={chamar}
              className="mt-2 rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Chamar agora
            </button>
          </>
        )}

        {estado === "chamando" && (
          <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Chamando o porteiro... aguarde.
          </p>
        )}

        {estado === "atendido" && (
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <Check className="h-4 w-4" /> Porteiro a caminho. Tempo estimado: 2 min.
            </p>
          </div>
        )}

        <button onClick={voltar} className="mt-4 text-sm text-neutral-500 underline">
          Voltar
        </button>
      </div>
    </div>
  );
}

// Mínimo de tipos para SpeechRecognition (não tipado por padrão)
type SRInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type SRConstructor = new () => SRInstance;

function Voz({ voltar }: { voltar: () => void }) {
  const [ouvindo, setOuvindo] = useState(false);
  const [transcricao, setTranscricao] = useState("");
  const [resposta, setResposta] = useState("Toque em 'Ativar' e diga um comando, por exemplo: 'abrir mapa'.");
  const recRef = useRef<SRInstance | null>(null);

  const falar = (texto: string) => {
    setResposta(texto);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = "pt-BR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const executar = (txt: string) => {
    const t = txt.toLowerCase();
    const rotas: Array<{ k: string[]; to: string; nome: string }> = [
      { k: ["mapa"], to: "/mapa", nome: "Mapa" },
      { k: ["menu", "início", "inicio", "principal"], to: "/menu", nome: "Menu" },
      { k: ["entrada", "recepção", "recepcao", "portaria"], to: "/entrada", nome: "Entrada" },
      { k: ["academia"], to: "/academia", nome: "Academia" },
      { k: ["edifícios", "edificios", "prédios", "predios"], to: "/edificios", nome: "Edifícios" },
      { k: ["brinquedoteca"], to: "/brinquedoteca", nome: "Brinquedoteca" },
      { k: ["lavanderia"], to: "/lavanderia", nome: "Lavanderia" },
      { k: ["bicicletário", "bicicletario", "bike"], to: "/bicicletario", nome: "Bicicletário" },
      { k: ["choupana"], to: "/choupanas", nome: "Choupanas" },
      { k: ["salão", "salao", "gourmet"], to: "/salao-gourmet", nome: "Salão Gourmet" },
      { k: ["festa"], to: "/area-festas", nome: "Área de Festas" },
      { k: ["quadra", "esporte"], to: "/quadras", nome: "Quadras" },
    ];
    const m = rotas.find((r) => r.k.some((k) => t.includes(k)));
    if (m) {
      falar(`Abrindo ${m.nome}.`);
      setTimeout(() => {
        window.location.href = m.to;
      }, 900);
      return;
    }
    if (t.includes("porteiro") || t.includes("ajuda") || t.includes("socorro")) {
      falar("Chamando o porteiro.");
      return;
    }
    falar("Comando não reconhecido. Tente: abrir mapa, ir para academia, ou chamar porteiro.");
  };

  const ativar = () => {
    const SR =
      (typeof window !== "undefined" &&
        ((window as unknown as { SpeechRecognition?: SRConstructor }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: SRConstructor }).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      falar("Reconhecimento de voz não suportado neste navegador.");
      return;
    }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      setTranscricao(txt);
      executar(txt);
    };
    rec.onend = () => setOuvindo(false);
    rec.onerror = () => setOuvindo(false);
    recRef.current = rec;
    setOuvindo(true);
    setTranscricao("");
    falar("Estou ouvindo.");
    rec.start();
  };

  const parar = () => {
    recRef.current?.stop();
    setOuvindo(false);
  };

  useEffect(() => () => recRef.current?.stop(), []);

  return (
    <div className="mt-10 w-full rounded-xl border border-neutral-200 bg-white p-8">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={ouvindo ? parar : ativar}
          aria-label={ouvindo ? "Parar escuta de voz" : "Ativar escuta de voz"}
          className={`grid h-20 w-20 place-items-center rounded-full text-white transition ${
            ouvindo ? "bg-red-600 animate-pulse" : "bg-neutral-900 hover:bg-neutral-800"
          }`}
        >
          {ouvindo ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </button>
        <h2 className="font-serif text-2xl text-neutral-900">Comando de Voz</h2>
        <p className="text-sm text-neutral-700" aria-live="polite">
          {resposta}
        </p>
        {transcricao && (
          <p className="rounded-md bg-neutral-100 px-3 py-2 text-xs text-neutral-700">
            Você disse: “{transcricao}”
          </p>
        )}
        <div className="mt-2 w-full max-w-md rounded-md bg-neutral-50 p-4 text-left text-xs text-neutral-600">
          <p className="font-medium text-neutral-800">Comandos disponíveis:</p>
          <ul className="mt-1 list-disc pl-5">
            <li>“abrir mapa”, “ir para academia”, “menu”</li>
            <li>“entrada”, “brinquedoteca”, “lavanderia”, “bicicletário”</li>
            <li>“salão gourmet”, “área de festas”, “quadras”, “choupanas”</li>
            <li>“chamar porteiro”</li>
          </ul>
        </div>
        <button onClick={voltar} className="mt-2 text-sm text-neutral-500 underline">
          Voltar
        </button>
      </div>
    </div>
  );
}
