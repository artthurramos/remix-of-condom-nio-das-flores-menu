import { useState } from "react";
import { AlertTriangle, X, Ambulance, Shield, Flame, Phone } from "lucide-react";
import { feedback, playClick } from "@/lib/feedback";

const services = [
  { label: "SAMU", number: "192", icon: Ambulance, color: "bg-red-600" },
  { label: "Polícia", number: "190", icon: Shield, color: "bg-blue-700" },
  { label: "Bombeiros", number: "193", icon: Flame, color: "bg-orange-600" },
  { label: "Emergência", number: "911", icon: Phone, color: "bg-rose-700" },
];

export function EmergencyButton() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    playClick("tap");
    feedback(open ? "Fechar emergência" : "Emergência", "open");
    setOpen(!open);
  };

  const call = (label: string, number: string) => {
    feedback(`Ligando para ${label}`, "confirm");
    window.location.href = `tel:${number}`;
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label="Emergência"
        className="fixed bottom-6 right-6 z-[60] grid h-16 w-16 place-items-center rounded-full bg-red-600 text-white shadow-2xl ring-4 ring-red-600/30 transition hover:bg-red-700 hover:scale-105 animate-pulse"
      >
        <AlertTriangle className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={toggle}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="font-serif text-2xl text-neutral-900">Emergência</h2>
              </div>
              <button
                onClick={toggle}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              Selecione o serviço para realizar a chamada imediata.
            </p>

            <div className="mt-5 grid gap-3">
              {services.map(({ label, number, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => call(label, number)}
                  className={`flex items-center gap-4 rounded-xl ${color} px-5 py-4 text-left text-white shadow-md transition hover:brightness-110`}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-lg">{label}</span>
                    <span className="text-xs uppercase tracking-widest text-white/85">
                      Ligar {number}
                    </span>
                  </span>
                  <Phone className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
