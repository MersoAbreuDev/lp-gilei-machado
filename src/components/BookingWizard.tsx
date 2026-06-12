import { useCallback, useEffect, useMemo, useState } from "react";
import {
  bookSalonAppointment,
  fetchSalonServices,
  fetchSalonSlots,
  formatCurrency,
  formatPhoneMask,
  getSalonSlug,
  lookupSalonClient,
} from "@/lib/api";
import { getSalonNickname, setSalonNickname } from "@/lib/local-storage";
import type { PublicSalonService, PublicSalonSlot } from "@/types/salon";

type Step = "date" | "time" | "service" | "contact" | "success";

type Props = {
  open: boolean;
  onClose: () => void;
  preselectedService?: PublicSalonService | null;
  serviceProviderId?: string | null;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const wd = WEEKDAYS[d.getDay()] ?? "";
  return `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function dateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const STEP_TITLES: Record<Step, string> = {
  date: "Escolha o dia",
  time: "Escolha o horário",
  service: "Escolha o serviço",
  contact: "Seus dados",
  success: "Agendamento confirmado",
};

export function BookingWizard({
  open,
  onClose,
  preselectedService = null,
  serviceProviderId = null,
}: Props) {
  const slug = getSalonSlug();
  const [step, setStep] = useState<Step>("date");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PublicSalonSlot | null>(null);
  const [selectedService, setSelectedService] = useState<PublicSalonService | null>(
    preselectedService,
  );
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successLabel, setSuccessLabel] = useState("");

  const [slots, setSlots] = useState<PublicSalonSlot[]>([]);
  const [services, setServices] = useState<PublicSalonService[]>([]);
  const [scheduleText, setScheduleText] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [slotsRes, servicesRes] = await Promise.all([
        fetchSalonSlots(),
        fetchSalonServices(),
      ]);
      setSlots(slotsRes.slots);
      setScheduleText(slotsRes.scheduleText);
      setServices(servicesRes.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar horários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setStep("date");
    setSelectedDateKey(null);
    setSelectedSlot(null);
    setSelectedService(preselectedService);
    setPhone("");
    setName("");
    setNickname(getSalonNickname(slug));
    setError(null);
    setSuccessLabel("");
    void loadData();
  }, [open, preselectedService, slug, loadData]);

  const availableDates = useMemo(() => {
    const map = new Map<string, string>();
    for (const slot of slots) {
      const key = dateKey(slot.startsAt);
      if (!map.has(key)) {
        map.set(key, formatDateLabel(slot.startsAt));
      }
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  const slotsForDate = useMemo(() => {
    if (!selectedDateKey) return [];
    return slots.filter((s) => dateKey(s.startsAt) === selectedDateKey);
  }, [slots, selectedDateKey]);

  const goBack = () => {
    setError(null);
    if (step === "time") setStep("date");
    else if (step === "service") setStep("time");
    else if (step === "contact") setStep(preselectedService ? "time" : "service");
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedService) return;
    setSubmitting(true);
    setError(null);
    try {
      const lookup = await lookupSalonClient({ phone, name });
      if (!lookup.found) {
        throw new Error(lookup.message);
      }
      const result = await bookSalonAppointment({
        phone,
        name,
        startsAt: selectedSlot.startsAt,
        catalogServiceId: selectedService.id,
        serviceProviderId: serviceProviderId ?? undefined,
      });
      setSalonNickname(slug, nickname);
      setSuccessLabel(result.appointment.label);
      setStep("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao agendar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-gm-surface p-6 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gm-heading">
              {STEP_TITLES[step]}
            </h2>
            {step === "contact" && (
              <p className="mt-1 text-sm text-gm-muted">
                Informe celular e nome como estão cadastrados no studio.
              </p>
            )}
          </div>
          <button
            type="button"
            className="text-gm-muted hover:text-gm-heading"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {step !== "date" && step !== "success" && (
          <button
            type="button"
            className="mb-4 text-sm text-gm-primary hover:underline"
            onClick={goBack}
          >
            ← Voltar
          </button>
        )}

        {loading && step !== "success" ? (
          <p className="py-12 text-center text-gm-muted">Carregando…</p>
        ) : (
          <>
            {step === "date" && (
              <div className="space-y-4">
                {preselectedService && (
                  <div className="rounded-xl bg-gm-blush px-4 py-3 text-sm">
                    Serviço: <strong>{preselectedService.name}</strong> —{" "}
                    {formatCurrency(preselectedService.value)}
                  </div>
                )}
                {availableDates.length === 0 ? (
                  <p className="py-8 text-center text-gm-muted">
                    Nenhum horário disponível no momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {availableDates.map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                          selectedDateKey === key
                            ? "border-gm-primary bg-gm-primary text-white"
                            : "border-gm-line hover:border-gm-primary/50"
                        }`}
                        onClick={() => {
                          setSelectedDateKey(key);
                          setError(null);
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                {scheduleText && (
                  <p className="text-center text-xs text-gm-muted">{scheduleText}</p>
                )}
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={!selectedDateKey}
                  onClick={() => {
                    if (!selectedDateKey) {
                      setError("Selecione um dia.");
                      return;
                    }
                    setError(null);
                    setStep("time");
                  }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === "time" && (
              <div className="space-y-4">
                {selectedDateKey && (
                  <p className="text-center text-sm text-gm-body">
                    {availableDates.find(([k]) => k === selectedDateKey)?.[1]}
                  </p>
                )}
                {slotsForDate.length === 0 ? (
                  <p className="py-8 text-center text-gm-muted">
                    Nenhum horário neste dia.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slotsForDate.map((slot) => (
                      <button
                        key={slot.startsAt}
                        type="button"
                        className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                          selectedSlot?.startsAt === slot.startsAt
                            ? "border-gm-primary bg-gm-primary text-white"
                            : "border-gm-line hover:border-gm-primary/50"
                        }`}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setError(null);
                        }}
                      >
                        {slot.hm}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={!selectedSlot}
                  onClick={() => {
                    if (!selectedSlot) {
                      setError("Selecione um horário.");
                      return;
                    }
                    setError(null);
                    setStep(preselectedService ? "contact" : "service");
                  }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === "service" && (
              <div className="space-y-4">
                <select
                  className="input-field"
                  value={selectedService?.id ?? ""}
                  onChange={(e) => {
                    const svc = services.find((s) => s.id === e.target.value) ?? null;
                    setSelectedService(svc);
                    setError(null);
                  }}
                >
                  <option value="">Selecione o serviço</option>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name} — {formatCurrency(svc.value)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={!selectedService}
                  onClick={() => {
                    if (!selectedService) {
                      setError("Selecione um serviço.");
                      return;
                    }
                    setError(null);
                    setStep("contact");
                  }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === "contact" && (
              <div className="space-y-4">
                {selectedService && selectedSlot && (
                  <div className="rounded-xl bg-gm-blush px-4 py-3 text-sm space-y-1">
                    <p>
                      <strong>{selectedService.name}</strong> —{" "}
                      {formatCurrency(selectedService.value)}
                    </p>
                    <p className="text-gm-muted">{selectedSlot.label}</p>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium">Celular *</label>
                  <input
                    className="input-field"
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneMask(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nome *</label>
                  <input
                    className="input-field"
                    placeholder="Como está no cadastro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Apelido (opcional)
                  </label>
                  <input
                    className="input-field"
                    placeholder="Como prefere ser chamada"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gm-muted">
                    Fica salvo só neste aparelho — não é enviado ao sistema.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={submitting || !phone.trim() || !name.trim()}
                  onClick={() => void handleSubmit()}
                >
                  {submitting ? "Confirmando…" : "Confirmar agendamento"}
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="text-5xl text-gm-primary">✓</div>
                <p className="text-lg font-semibold">Tudo certo!</p>
                <p className="text-sm text-gm-body">{successLabel}</p>
                {selectedService && (
                  <p className="text-sm">
                    {selectedService.name} — {formatCurrency(selectedService.value)}
                  </p>
                )}
                <button type="button" className="btn-primary w-full" onClick={onClose}>
                  Fechar
                </button>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
