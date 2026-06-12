import { formatCurrency } from "@/lib/api";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionHeading } from "@/components/SectionHeading";
import type { PublicSalonService } from "@/types/salon";

type Props = {
  services: PublicSalonService[];
  loading: boolean;
  error: string | null;
  onSelectService: (service: PublicSalonService) => void;
};

function ServiceSkeleton() {
  return <div className="skeleton h-28 rounded-xl" aria-hidden />;
}

export function ServicesSection({
  services,
  loading,
  error,
  onSelectService,
}: Props) {
  return (
    <section
      id="servicos"
      className="scroll-mt-20 bg-gm-surface/90 px-5 py-16 backdrop-blur-sm sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Serviços"
            title="Procedimentos e valores"
            subtitle="Toque em um serviço para agendar."
            className="mb-10"
          />
        </RevealOnScroll>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="py-8 text-center text-red-600">{error}</p>
        ) : services.length === 0 ? (
          <RevealOnScroll delay={100}>
            <p className="rounded-xl border border-gm-line/60 py-12 text-center text-gm-muted">
              Serviços em breve. Entre em contato para agendar.
            </p>
          </RevealOnScroll>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((svc, i) => (
              <RevealOnScroll key={svc.id} delay={Math.min(i * 80, 320)}>
                <button
                  type="button"
                  className="service-card service-card-enter text-left"
                  onClick={() => onSelectService(svc)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gm-heading">{svc.name}</h3>
                      {svc.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gm-body">{svc.description}</p>
                      )}
                      {svc.estimatedTime && (
                        <p className="mt-1 text-xs text-gm-muted">{svc.estimatedTime}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm font-bold text-gm-primary">
                      {formatCurrency(svc.value)}
                    </span>
                  </div>
                </button>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
