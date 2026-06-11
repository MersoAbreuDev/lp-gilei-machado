import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";

type Props = {
  onBookClick: () => void;
};

const NAV = [
  { href: "#atendimento", label: "Atendimento" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
];

export function Header({ onBookClick }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-gm-gold/20 bg-gm-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="#" className="flex items-center gap-3 shrink-0">
          <Logo />
          <div>
            <p className="font-serif text-lg font-semibold text-gm-primary-deep leading-tight">
              {BRAND.name}
            </p>
            <p className="text-xs text-gm-primary/70">{BRAND.tagline}</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gm-text/80 transition hover:text-gm-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button type="button" className="btn-primary !py-2.5 !text-xs" onClick={onBookClick}>
          Agendar
        </button>
      </div>
    </header>
  );
}
