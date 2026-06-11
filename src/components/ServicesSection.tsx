import { formatCurrency } from "@/lib/api";
import type { PublicSalonService } from "@/types/salon";

type Props = {
  services: PublicSalonService[];
  loading: boolean;
  error: string | null;
  onSelectService: (service: PublicSalonService) => void;
};

export function ServicesSection({
  services,
  loading,
  error,
  onSelectService,
}: Props) {
  return (
    <section id="servicos" className="bg-gm-cream-soft px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-bold text-gm-primary-deep sm:text-4xl">
            Serviços &amp; Valores
          </h2>
          <p className="mt-2 text-gm-text/60">
            Clique em um serviço para agendar diretamente
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-gm-text/50">Carregando serviços…</p>
        ) : error ? (
          <p className="py-8 text-center text-red-600">{error}</p>
        ) : services.length === 0 ? (
          <p className="py-8 text-center text-gm-text/50">
            Serviços em breve. Entre em contato para agendar.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <button
                key={svc.id}
                type="button"
                className="service-card text-left"
                onClick={() => onSelectService(svc)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{svc.name}</h3>
                  <span className="shrink-0 text-sm font-bold text-gm-primary">
                    {formatCurrency(svc.value)}
                  </span>
                </div>
                {svc.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gm-text/60">
                    {svc.description}
                  </p>
                )}
                {svc.estimatedTime && (
                  <p className="mt-1 text-xs text-gm-text/50">
                    Duração: {svc.estimatedTime}
                  </p>
                )}
                <p className="mt-3 text-xs font-medium text-gm-gold">Agendar →</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
