import { BRAND } from "@/lib/brand";
import { Logo } from "./Logo";

type Props = {
  organizationName?: string;
  city?: string | null;
  state?: string | null;
  onBookClick: () => void;
};

export function Hero({ organizationName, city, state, onBookClick }: Props) {
  const displayName = organizationName ?? BRAND.name;

  return (
    <section
      id="atendimento"
      className="scroll-mt-20 border-b border-gm-line/40 bg-gm-canvas/70 px-5 pb-16 pt-14 backdrop-blur-[2px] sm:px-8 sm:pb-20 sm:pt-16"
    >
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="hero-enter hero-enter-1">
          <Logo size="xl" className="mx-auto logo-glow" />
        </div>

        <div className="hero-enter hero-enter-2">
          <h1 className="mt-8 text-3xl font-bold leading-tight text-gm-heading sm:text-4xl">
            {displayName}
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-gm-primary">
            Manicure e pedicure
          </p>
        </div>

        <p className="hero-enter hero-enter-3 mx-auto mt-5 max-w-lg text-base leading-relaxed text-gm-body sm:text-lg">
          {BRAND.heroSubtitle}
        </p>

        <ul className="hero-enter hero-enter-4 mt-8 flex flex-wrap justify-center gap-2">
          {BRAND.trustItems.map((item, i) => (
            <li
              key={item.label}
              className="trust-pill trust-pill-enter"
              style={{ animationDelay: `${0.5 + i * 0.08}s` }}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>

        <div className="hero-enter hero-enter-5 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="btn-primary btn-shimmer min-w-[200px]"
            onClick={onBookClick}
          >
            Agendar horário
          </button>
          <a href="#servicos" className="btn-outline min-w-[200px]">
            Ver serviços
          </a>
        </div>

        {city && (
          <p className="hero-enter hero-enter-6 mt-8 text-sm text-gm-muted">
            {city}
            {state ? ` · ${state}` : ""}
          </p>
        )}
      </div>
    </section>
  );
}
