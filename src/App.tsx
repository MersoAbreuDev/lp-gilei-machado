import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection, Footer } from "@/components/AboutSection";
import { BookingWizard } from "@/components/BookingWizard";
import { fetchSalonInfo, fetchSalonServices } from "@/lib/api";
import type { PublicSalonInfo, PublicSalonService } from "@/types/salon";

export default function App() {
  const [info, setInfo] = useState<PublicSalonInfo | null>(null);
  const [services, setServices] = useState<PublicSalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<PublicSalonService | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [infoRes, servicesRes] = await Promise.all([
        fetchSalonInfo(),
        fetchSalonServices(),
      ]);
      setInfo(infoRes);
      setServices(servicesRes.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openWizard = (service?: PublicSalonService) => {
    setSelectedService(service ?? null);
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onBookClick={() => openWizard()} />
      <main className="flex-1">
        <Hero
          organizationName={info?.organizationName}
          city={info?.city}
          state={info?.state}
          onBookClick={() => openWizard()}
        />
        <ServicesSection
          services={services}
          loading={loading}
          error={error}
          onSelectService={(svc) => openWizard(svc)}
        />
        <AboutSection
          providerName={info?.serviceProvider?.name}
          onBookClick={() => openWizard()}
        />
      </main>
      <Footer />
      <BookingWizard
        open={wizardOpen}
        onClose={closeWizard}
        preselectedService={selectedService}
        serviceProviderId={info?.serviceProvider?.id ?? null}
      />
    </div>
  );
}
