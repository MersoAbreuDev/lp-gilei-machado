import { BRAND } from "@/lib/brand";

type Props = {
  organizationName?: string;
  city?: string | null;
  state?: string | null;
  onBookClick: () => void;
};

export function Hero({ organizationName, city, state, onBookClick }: Props) {
  return (
    <section
      id="atendimento"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(201,169,110,0.35), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gm-gold">
          Experiência exclusiva
        </p>
        <h1 className="font-serif text-5xl font-bold tracking-tight text-gm-primary-deep sm:text-6xl">
          {organizationName ?? BRAND.name}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-gm-text/70">
          {BRAND.tagline}. Agende seu horário de forma rápida e prática.
        </p>
        <div className="mt-10">
          <button type="button" className="btn-primary" onClick={onBookClick}>
            Agendar atendimento
          </button>
        </div>
        {city && (
          <p className="mt-6 text-sm text-gm-text/50">
            {city}
            {state ? ` — ${state}` : ""}
          </p>
        )}
      </div>
    </section>
  );
}
