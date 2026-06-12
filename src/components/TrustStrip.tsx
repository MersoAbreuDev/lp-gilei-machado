import { BRAND } from "@/lib/brand";

export function TrustStrip() {
  return (
    <section className="px-5 py-8 sm:px-8" aria-label="Diferenciais">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
        {BRAND.trustItems.map((item) => (
          <span key={item.label} className="trust-pill">
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
