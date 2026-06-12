import { BRAND } from "@/lib/brand";
import { Logo } from "./Logo";

type Props = {
  onBookClick: () => void;
};

const NAV = [
  { href: "#atendimento", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
];

export function Header({ onBookClick }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-gm-line/50 bg-gm-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
        <a href="#" className="flex min-w-0 items-center gap-3">
          <img
            src={BRAND.headerAvatarUrl}
            alt={`${BRAND.ownerName}, ${BRAND.name}`}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-gm-primary/35 shadow-soft"
          />
          <div className="flex min-w-0 items-center gap-2">
            <Logo size="sm" className="hidden sm:block" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-gm-heading">{BRAND.name}</p>
              <p className="hidden text-[10px] text-gm-muted sm:block">{BRAND.tagline}</p>
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-gm-body transition hover:text-gm-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button type="button" className="btn-primary shrink-0 !py-2 !px-4 !text-xs" onClick={onBookClick}>
          Agendar
        </button>
      </div>
    </header>
  );
}
