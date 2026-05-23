import { createFileRoute } from "@tanstack/react-router";
import { BackToMenu } from "@/components/BackToMenu";
import {
  Home,
  UserRound,
  Wrench,
  Check,
  ScanFace,
  Camera,
  X,
  Package,
  Hammer,
  ArrowLeft,
  Boxes,
  UtensilsCrossed,
  Phone,
  BellRing,
  CalendarDays,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import entradaBg from "@/assets/entrada-bg.jpg";

export const Route = createFileRoute("/entrada")({
  component: EntradaPage,
});

type Tipo = "morador" | "visitante" | "prestador";

const opcoes: { id: Tipo; label: string; descricao: string; Icon: typeof Home }[] = [
  { id: "morador", label: "Morador", descricao: "Residente do condomínio com acesso completo.", Icon: Home },
  { id: "visitante", label: "Visitante", descricao: "Convidado autorizado por um morador.", Icon: UserRound },
  { id: "prestador", label: "Prestador de Serviço", descricao: "Profissional contratado para atendimento.", Icon: Wrench },
];

function falar(texto: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = 1;
    window.speechSynthesis.speak(u);
  } catch {}
}

function EntradaPage() {
  const [selecionado, setSelecionado] = useState<Tipo | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-900 text-white">
      <img
        src={entradaBg}
        alt="Entrada do Condomínio das Flores"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/70 to-neutral-950/90" />
      <div className="relative z-10">
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

          {selecionado === "morador" && (
            <FluxoMorador onClose={() => setSelecionado(null)} />
          )}
          {selecionado === "visitante" && (
            <FluxoVisitante onClose={() => setSelecionado(null)} />
          )}
          {selecionado === "prestador" && (
            <FluxoPrestador onClose={() => setSelecionado(null)} />
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------- Componente câmera + escaneamento facial ---------- */

type ResultadoFace = "passou" | "negado" | null;

function FaceScanner({
  onResultado,
  forcarResultado,
}: {
  onResultado?: (r: "passou" | "negado") => void;
  forcarResultado?: "passou" | "negado";
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [erroCamera, setErroCamera] = useState<string | null>(null);
  const [escaneando, setEscaneando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoFace>(null);

  useEffect(() => {
    let cancelado = false;
    async function iniciar() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelado) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        setErroCamera("Não foi possível acessar a câmera.");
      }
    }
    iniciar();
    return () => {
      cancelado = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const escanear = useCallback(() => {
    setResultado(null);
    setEscaneando(true);
    setTimeout(() => {
      const passou =
        forcarResultado ? forcarResultado === "passou" : Math.random() > 0.3;
      const r: "passou" | "negado" = passou ? "passou" : "negado";
      setResultado(r);
      setEscaneando(false);
      falar(passou ? "Passe livre" : "Incorreto");
      onResultado?.(r);
    }, 1800);
  }, [forcarResultado, onResultado]);

  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-black">
        {erroCamera ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-white/70">
            <Camera className="h-8 w-8 text-white/60" />
            <p>{erroCamera}</p>
            <p className="text-xs text-white/50">Permita o acesso à câmera no navegador.</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`h-48 w-40 rounded-[45%] border-2 transition ${
                  escaneando
                    ? "border-amber-300 animate-pulse"
                    : resultado === "passou"
                      ? "border-emerald-400"
                      : resultado === "negado"
                        ? "border-red-500"
                        : "border-white/70"
                }`}
              />
            </div>
            {escaneando && (
              <div className="absolute inset-x-0 top-0 h-1 animate-[scan_1.8s_linear] bg-gradient-to-b from-emerald-400/80 to-transparent" />
            )}
          </>
        )}
      </div>

      <button
        onClick={escanear}
        disabled={escaneando || !!erroCamera}
        className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm tracking-wide text-white transition hover:bg-white/20 disabled:opacity-50"
      >
        <ScanFace className="h-4 w-4" />
        {escaneando ? "Escaneando rosto..." : "Escanear rosto"}
      </button>

      {resultado === "passou" && (
        <div className="mt-5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-emerald-300">
          <span className="font-serif text-xl">Passe livre</span>
        </div>
      )}
      {resultado === "negado" && (
        <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-red-300">
          <span className="font-serif text-xl">Incorreto</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Wrapper de painel ---------- */

function Painel({
  titulo,
  onClose,
  children,
}: {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 w-full max-w-2xl rounded-2xl border border-white/15 bg-neutral-950/70 p-8 text-left backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-2xl">{titulo}</h3>
        <button
          onClick={onClose}
          className="rounded-full border border-white/20 p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

/* ---------- Morador ---------- */

function FluxoMorador({ onClose }: { onClose: () => void }) {
  return (
    <Painel titulo="Reconhecimento facial — Morador" onClose={onClose}>
      <p className="mb-5 text-sm text-white/70">
        Posicione o rosto dentro do quadro e toque em escanear.
      </p>
      <FaceScanner />
    </Painel>
  );
}

/* ---------- Visitante ---------- */

type EtapaVis = "dados" | "aguardando" | "scan" | "concluido";

function FluxoVisitante({ onClose }: { onClose: () => void }) {
  const [etapa, setEtapa] = useState<EtapaVis>("dados");
  const [bloco, setBloco] = useState("");
  const [andar, setAndar] = useState("");
  const [apto, setApto] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloco || !andar || !apto) return;
    setEtapa("aguardando");
  };

  return (
    <Painel titulo="Acesso de Visitante" onClose={onClose}>
      {etapa === "dados" && (
        <form onSubmit={enviar} className="grid gap-4">
          <p className="text-sm text-white/70">
            Informe os dados do morador que você vai visitar.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Campo label="Bloco" value={bloco} onChange={setBloco} placeholder="Ex: A" />
            <Campo label="Andar" value={andar} onChange={setAndar} placeholder="Ex: 5" />
            <Campo label="Apartamento" value={apto} onChange={setApto} placeholder="Ex: 503" />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full border border-white/30 bg-white text-neutral-900 px-5 py-2.5 text-sm font-medium transition hover:bg-white/90"
          >
            Solicitar autorização
          </button>
        </form>
      )}

      {etapa === "aguardando" && (
        <div className="grid gap-5 text-center">
          <p className="text-sm text-white/70">
            Solicitação enviada ao morador do{" "}
            <span className="text-white">
              Bloco {bloco} · {andar}º andar · Apto {apto}
            </span>
            .
          </p>
          <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-amber-200">
            Aguardando confirmação do morador...
          </div>
          <button
            onClick={() => setEtapa("scan")}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-5 py-2.5 text-sm text-emerald-200 transition hover:bg-emerald-500/25"
          >
            <Check className="h-4 w-4" /> Morador confirmou
          </button>
        </div>
      )}

      {etapa === "scan" && (
        <div className="grid gap-4">
          <p className="text-sm text-white/70">
            Morador confirmou. Escaneie o rosto para liberar o acesso.
          </p>
          <FaceScanner onResultado={(r) => r === "passou" && setEtapa("concluido")} />
          <button
            onClick={() => setEtapa("dados")}
            className="mx-auto inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Recomeçar
          </button>
        </div>
      )}

      {etapa === "concluido" && (
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-4 text-emerald-200">
          Acesso liberado. Boa visita!
        </div>
      )}
    </Painel>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/50"
      />
    </label>
  );
}

/* ---------- Prestador ---------- */

type CategoriaPrestador = "entregas" | "servicos";
type TipoEntrega = "encomendas" | "comida";

type EncomendaSimulada = {
  id: string;
  remetente: string;
  descricao: string;
  prazo: string;
};

function gerarEncomendasSimuladas(bloco: string, andar: string, apto: string): EncomendaSimulada[] {
  const chave = `${bloco}-${andar}-${apto}`.toLowerCase();
  const base: EncomendaSimulada[] = [
    { id: "1", remetente: "Mercado Livre", descricao: "Caixa média · Eletrônico", prazo: "Hoje" },
    { id: "2", remetente: "Amazon", descricao: "Envelope · Livro", prazo: "Amanhã" },
    { id: "3", remetente: "Shopee", descricao: "Pacote pequeno · Acessório", prazo: "Em 3 dias" },
    { id: "4", remetente: "Magalu", descricao: "Caixa grande · Eletrodoméstico", prazo: "Em 5 dias" },
  ];
  // pseudo-variação por apartamento
  const n = (chave.charCodeAt(0) || 65) % 3;
  return base.slice(0, 2 + n);
}

function FluxoPrestador({ onClose }: { onClose: () => void }) {
  const [cat, setCat] = useState<CategoriaPrestador | null>(null);

  const opcoesCat: { id: CategoriaPrestador; label: string; Icon: typeof Package; desc: string }[] = [
    { id: "entregas", label: "Entregas", Icon: Package, desc: "Encomendas, alimentação, mercados." },
    { id: "servicos", label: "Serviços", Icon: Hammer, desc: "Manutenção, limpeza, técnicos." },
  ];

  return (
    <Painel titulo="Prestador de Serviço" onClose={onClose}>
      {!cat && (
        <>
          <p className="mb-5 text-sm text-white/70">Selecione a categoria do atendimento.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {opcoesCat.map(({ id, label, Icon, desc }) => (
              <button
                key={id}
                onClick={() => setCat(id)}
                className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-8 text-center transition hover:border-white/40 hover:bg-white/10"
              >
                <Icon className="h-10 w-10 text-white/85" />
                <h4 className="mt-4 font-serif text-xl">{label}</h4>
                <p className="mt-1 text-xs text-white/60">{desc}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {cat === "entregas" && <FluxoEntregas onVoltar={() => setCat(null)} />}

      {cat === "servicos" && (
        <div className="grid gap-4 text-center">
          <p className="text-sm text-white/70">
            Categoria selecionada: <span className="font-serif text-base text-white">Serviços</span>
          </p>
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-4 text-emerald-200">
            Acesso encaminhado à portaria. Aguarde liberação.
          </div>
          <button
            onClick={() => setCat(null)}
            className="mx-auto inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Trocar categoria
          </button>
        </div>
      )}
    </Painel>
  );
}

/* ---------- Entregas (encomendas + comida) ---------- */

function FluxoEntregas({ onVoltar }: { onVoltar: () => void }) {
  const [tipo, setTipo] = useState<TipoEntrega | null>(null);

  if (!tipo) {
    return (
      <>
        <p className="mb-5 text-sm text-white/70">Qual é o tipo de entrega?</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setTipo("encomendas")}
            className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-8 text-center transition hover:border-white/40 hover:bg-white/10"
          >
            <Boxes className="h-10 w-10 text-white/85" />
            <h4 className="mt-4 font-serif text-xl">Encomendas</h4>
            <p className="mt-1 text-xs text-white/60">Pacotes e mercadorias.</p>
          </button>
          <button
            onClick={() => setTipo("comida")}
            className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-8 text-center transition hover:border-white/40 hover:bg-white/10"
          >
            <UtensilsCrossed className="h-10 w-10 text-white/85" />
            <h4 className="mt-4 font-serif text-xl">Comida</h4>
            <p className="mt-1 text-xs text-white/60">Restaurantes e delivery.</p>
          </button>
        </div>
        <button
          onClick={onVoltar}
          className="mx-auto mt-6 inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" /> Trocar categoria
        </button>
      </>
    );
  }

  return tipo === "encomendas" ? (
    <FluxoEncomendas onVoltar={() => setTipo(null)} />
  ) : (
    <FluxoComida onVoltar={() => setTipo(null)} />
  );
}

/* ---------- Encomendas ---------- */

function FluxoEncomendas({ onVoltar }: { onVoltar: () => void }) {
  const [bloco, setBloco] = useState("");
  const [andar, setAndar] = useState("");
  const [apto, setApto] = useState("");
  const [lista, setLista] = useState<EncomendaSimulada[] | null>(null);
  const [escolhida, setEscolhida] = useState<EncomendaSimulada | null>(null);
  const [notificado, setNotificado] = useState(false);

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloco || !andar || !apto) return;
    setLista(gerarEncomendasSimuladas(bloco, andar, apto));
  };

  const confirmar = (enc: EncomendaSimulada) => {
    setEscolhida(enc);
    setNotificado(true);
    falar("Notificação enviada ao morador. Porteiro irá receber a encomenda.");
  };

  if (notificado && escolhida) {
    return (
      <div className="grid gap-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <BellRing className="h-6 w-6" />
        </div>
        <p className="font-serif text-xl">Morador notificado</p>
        <p className="text-sm text-white/70">
          Encomenda <span className="text-white">{escolhida.remetente}</span> ·{" "}
          {escolhida.descricao} para o{" "}
          <span className="text-white">
            Bloco {bloco} · {andar}º · Apto {apto}
          </span>
          .
        </p>
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-4 text-emerald-200">
          Notificação enviada ao celular do morador. O porteiro receberá a encomenda.
        </div>
        <button
          onClick={onVoltar}
          className="mx-auto inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" /> Nova entrega
        </button>
      </div>
    );
  }

  if (lista) {
    return (
      <div className="grid gap-4">
        <p className="text-sm text-white/70">
          Encomendas previstas para o{" "}
          <span className="text-white">
            Bloco {bloco} · {andar}º · Apto {apto}
          </span>{" "}
          nos próximos dias:
        </p>
        <ul className="grid gap-2">
          {lista.map((enc) => (
            <li
              key={enc.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3"
            >
              <div className="text-left">
                <p className="font-serif text-base text-white">{enc.remetente}</p>
                <p className="text-xs text-white/60">{enc.descricao}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/50">
                  <CalendarDays className="h-3 w-3" /> {enc.prazo}
                </p>
              </div>
              <button
                onClick={() => confirmar(enc)}
                className="rounded-full border border-white/30 bg-white px-4 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white/90"
              >
                É esta
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setLista(null)}
          className="mx-auto inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" /> Corrigir endereço
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={buscar} className="grid gap-4">
      <p className="text-sm text-white/70">
        Informe o endereço do morador que solicitou a entrega.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Campo label="Bloco" value={bloco} onChange={setBloco} placeholder="Ex: A" />
        <Campo label="Andar" value={andar} onChange={setAndar} placeholder="Ex: 5" />
        <Campo label="Apartamento" value={apto} onChange={setApto} placeholder="Ex: 503" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" /> Voltar
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
        >
          Ver encomendas previstas
        </button>
      </div>
    </form>
  );
}

/* ---------- Comida ---------- */

function FluxoComida({ onVoltar }: { onVoltar: () => void }) {
  const [bloco, setBloco] = useState("");
  const [andar, setAndar] = useState("");
  const [apto, setApto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [chamando, setChamando] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloco || !andar || !apto) return;
    setEnviado(true);
  };

  const interfonar = () => {
    setChamando(true);
    falar(`Chamando interfone do apartamento ${apto}, bloco ${bloco}.`);
    setTimeout(() => setChamando(false), 2500);
  };

  if (!enviado) {
    return (
      <form onSubmit={enviar} className="grid gap-4">
        <p className="text-sm text-white/70">
          Informe o endereço de entrega da comida.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo label="Bloco" value={bloco} onChange={setBloco} placeholder="Ex: A" />
          <Campo label="Andar" value={andar} onChange={setAndar} placeholder="Ex: 5" />
          <Campo label="Apartamento" value={apto} onChange={setApto} placeholder="Ex: 503" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onVoltar}
            className="inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
          >
            Continuar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="grid gap-4 text-center">
      <p className="text-sm text-white/70">
        Entrega para o{" "}
        <span className="text-white">
          Bloco {bloco} · {andar}º · Apto {apto}
        </span>
        .
      </p>
      <button
        onClick={interfonar}
        disabled={chamando}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-6 py-3 text-emerald-200 transition hover:bg-emerald-500/25 disabled:opacity-60"
      >
        <Phone className={`h-4 w-4 ${chamando ? "animate-pulse" : ""}`} />
        {chamando ? "Chamando interfone..." : "Interfonar para o apartamento"}
      </button>
      <button
        onClick={onVoltar}
        className="mx-auto inline-flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" /> Nova entrega
      </button>
    </div>
  );
}
