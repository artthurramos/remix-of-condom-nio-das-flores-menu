import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackToMenu() {
  return (
    <Link
      to="/"
      className="fixed left-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-black/80"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar ao Menu
    </Link>
  );
}
