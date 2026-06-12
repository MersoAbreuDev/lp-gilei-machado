import { BRAND } from "@/lib/brand";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionHeading } from "@/components/SectionHeading";
import { getInstagramUrl, getWhatsappDigits } from "@/lib/runtime-env";

type Props = {
  providerName?: string | null;
  onBookClick: () => void;
};

export function AboutSection({ providerName, onBookClick }: Props) {
  const ownerName = providerName ?? BRAND.ownerName;
  const firstName = ownerName.split(" ")[0];

  return (
    <section id="sobre" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-[280px_1fr] md:gap-12 lg:grid-cols-[320px_1fr]">
          <RevealOnScroll className="mx-auto w-full max-w-[280px] md:max-w-none">
            <figure>
              <div className="photo-zoom mx-auto w-64 overflow-hidden rounded-full bg-gm-blush shadow-soft ring-4 ring-white">
                <img
                  src={BRAND.ownerPhotoUrl}
                  alt={`${ownerName}, proprietária do ${BRAND.name}`}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center md:text-left">
                <p className="font-bold text-gm-heading">{ownerName}</p>
                <p className="text-sm text-gm-primary">{BRAND.ownerRole}</p>
              </figcaption>
            </figure>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <SectionHeading
              align="left"
              eyebrow="Quem cuida de você"
              title={`Olá, eu sou a ${firstName}`}
              subtitle={BRAND.ownerBio}
              className="max-w-none"
            />

            <blockquote className="owner-quote mt-6">
              &ldquo;{BRAND.ownerQuote}&rdquo;
            </blockquote>

            <ul className="mt-6 space-y-2.5">
              {BRAND.highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gm-body">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gm-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <button type="button" className="btn-primary mt-8" onClick={onBookClick}>
              Agendar com a {firstName}
            </button>
          </RevealOnScroll>
        </div>

        <div className="mt-20 border-t border-gm-line/50 pt-16">
          <RevealOnScroll>
            <SectionHeading
              eyebrow="Nosso espaço"
              title="Ambiente pensado para o seu conforto"
              subtitle={BRAND.studioDescription}
              className="mb-8"
            />
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="photo-zoom overflow-hidden rounded-2xl shadow-soft">
              <img
                src={BRAND.studioPhotoUrl}
                alt={`Interior do ${BRAND.name}`}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {BRAND.studioFeatures.map((feature, i) => (
              <RevealOnScroll key={feature.title} delay={150 + i * 80}>
                <div className="rounded-xl border border-gm-line/60 bg-gm-surface/90 px-4 py-4 text-center backdrop-blur-sm sm:text-left">
                  <p className="font-semibold text-gm-heading">{feature.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gm-muted">{feature.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ onBookClick }: { onBookClick: () => void }) {
  const whatsapp = getWhatsappDigits();
  const instagram = getInstagramUrl();

  return (
    <footer className="border-t border-gm-line/60 bg-gm-surface/90 px-5 py-10 backdrop-blur-sm sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-bold text-gm-heading">{BRAND.name}</p>
          <p className="mt-1 text-sm text-gm-muted">{BRAND.tagline}</p>
          {(whatsapp || instagram) && (
            <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gm-primary hover:underline"
                >
                  WhatsApp
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gm-primary hover:underline"
                >
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
        <button type="button" className="btn-primary" onClick={onBookClick}>
          Agendar agora
        </button>
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-gm-muted sm:text-left">
        © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
