import { BRAND } from "@/lib/brand";

type Props = {
  providerName?: string | null;
  onBookClick: () => void;
};

export function AboutSection({ providerName, onBookClick }: Props) {
  return (
    <section id="sobre" className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-bold text-gm-primary-deep sm:text-4xl">
          Sobre
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-gm-text/70">
          {BRAND.about}
        </p>
        {providerName && (
          <p className="mt-4 text-sm text-gm-text/60">
            Profissional: <strong className="text-gm-text">{providerName}</strong>
          </p>
        )}
        <button type="button" className="btn-outline mt-8" onClick={onBookClick}>
          Agendar agora
        </button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gm-gold/20 py-6 text-center text-xs text-gm-text/50">
      © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
    </footer>
  );
}
