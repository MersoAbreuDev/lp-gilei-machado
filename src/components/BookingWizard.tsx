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
import { formatEstimatedTimeLabel } from "@/lib/format-estimated-time";
import type { PublicSalonService, PublicSalonSlot } from "@/types/salon";

type Step = "service" | "date" | "time" | "contact" | "success";

type Props = {
  open: boolean;
  onClose: () => void;
  preselectedServices?: PublicSalonService[];
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
  service: "Escolha os serviços",
  date: "Escolha o dia",
  time: "Escolha o horário",
  contact: "Seus dados",
  success: "Agendamento confirmado",
};

export function BookingWizard({
  open,
  onClose,
  preselectedServices = [],
  serviceProviderId = null,
}: Props) {
  const slug = getSalonSlug();
  const [step, setStep] = useState<Step>("service");
  const [selectedServices, setSelectedServices] = useState<PublicSalonService[]>(
    [],
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PublicSalonSlot | null>(null);
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

  const selectedTotal = useMemo(
    () => selectedServices.reduce((sum, svc) => sum + svc.value, 0),
    [selectedServices],
  );

  const selectedIds = useMemo(
    () => new Set(selectedServices.map((svc) => svc.id)),
    [selectedServices],
  );

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
    setStep("service");
    setSelectedServices(preselectedServices);
    setSelectedDateKey(null);
    setSelectedSlot(null);
    setPhone("");
    setName("");
    setNickname(getSalonNickname(slug));
    setError(null);
    setSuccessLabel("");
    void loadData();
  }, [open, preselectedServices, slug, loadData]);

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

  const toggleService = (svc: PublicSalonService) => {
    setSelectedServices((prev) => {
      const exists = prev.some((item) => item.id === svc.id);
      if (exists) return prev.filter((item) => item.id !== svc.id);
      return [...prev, svc];
    });
    setError(null);
  };

  const goBack = () => {
    setError(null);
    if (step === "date") setStep("service");
    else if (step === "time") setStep("date");
    else if (step === "contact") setStep("time");
  };

  const handleSubmit = async () => {
    if (!selectedSlot || selectedServices.length === 0) return;
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
        catalogServiceIds: selectedServices.map((svc) => svc.id),
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
            {step === "service" && (
              <p className="mt-1 text-sm text-gm-muted">
                Selecione um ou mais serviços e toque em Prosseguir.
              </p>
            )}
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

        {step !== "service" && step !== "success" && (
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
            {step === "service" && (
              <div className="space-y-4">
                {selectedServices.length > 0 && (
                  <div className="rounded-xl bg-gm-blush px-4 py-3 text-sm">
                    <p className="font-medium text-gm-heading">
                      {selectedServices.length} serviço
                      {selectedServices.length > 1 ? "s" : ""} selecionado
                      {selectedServices.length > 1 ? "s" : ""}
                    </p>
                    <ul className="mt-2 space-y-1 text-gm-body">
                      {selectedServices.map((svc) => (
                        <li key={svc.id} className="flex justify-between gap-3">
                          <span>{svc.name}</span>
                          <span className="shrink-0 font-medium">
                            {formatCurrency(svc.value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 border-t border-gm-line/50 pt-2 font-semibold text-gm-primary">
                      Total: {formatCurrency(selectedTotal)}
                    </p>
                  </div>
                )}

                {services.length === 0 ? (
                  <p className="py-8 text-center text-gm-muted">
                    Nenhum serviço disponível no momento.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {services.map((svc) => {
                      const selected = selectedIds.has(svc.id);
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          className={`rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? "border-gm-primary bg-gm-primary/5 ring-1 ring-gm-primary"
                              : "border-gm-line hover:border-gm-primary/50"
                          }`}
                          onClick={() => toggleService(svc)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-semibold text-gm-heading">
                                {svc.name}
                              </p>
                              {svc.description && (
                                <p className="mt-1 line-clamp-2 text-sm text-gm-body">
                                  {svc.description}
                                </p>
                              )}
                              {formatEstimatedTimeLabel(svc.estimatedTime) && (
                                <p className="mt-1 text-xs text-gm-muted">
                                  {formatEstimatedTimeLabel(svc.estimatedTime)}
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <span className="text-sm font-bold text-gm-primary">
                                {formatCurrency(svc.value)}
                              </span>
                              <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                                  selected
                                    ? "border-gm-primary bg-gm-primary text-white"
                                    : "border-gm-line text-transparent"
                                }`}
                                aria-hidden
                              >
                                ✓
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={selectedServices.length === 0}
                  onClick={() => {
                    if (selectedServices.length === 0) {
                      setError("Selecione ao menos um serviço.");
                      return;
                    }
                    setError(null);
                    setStep("date");
                  }}
                >
                  Prosseguir
                </button>
              </div>
            )}

            {step === "date" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-gm-blush px-4 py-3 text-sm">
                  <p className="font-medium text-gm-heading">
                    {selectedServices.length} serviço
                    {selectedServices.length > 1 ? "s" : ""} —{" "}
                    {formatCurrency(selectedTotal)}
                  </p>
                </div>
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
                {selectedServices.length > 1 && (
                  <p className="text-center text-xs text-gm-muted">
                    {selectedServices.length} serviços — o horário reservará blocos
                    consecutivos na agenda.
                  </p>
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
                    setStep("contact");
                  }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === "contact" && (
              <div className="space-y-4">
                {selectedServices.length > 0 && selectedSlot && (
                  <div className="rounded-xl bg-gm-blush px-4 py-3 text-sm space-y-2">
                    <ul className="space-y-1">
                      {selectedServices.map((svc) => (
                        <li key={svc.id} className="flex justify-between gap-3">
                          <span>{svc.name}</span>
                          <span className="shrink-0 font-medium">
                            {formatCurrency(svc.value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-gm-line/50 pt-2 font-semibold text-gm-primary">
                      Total: {formatCurrency(selectedTotal)}
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
                {selectedServices.length > 0 && (
                  <div className="text-sm space-y-1">
                    {selectedServices.map((svc) => (
                      <p key={svc.id}>
                        {svc.name} — {formatCurrency(svc.value)}
                      </p>
                    ))}
                    {selectedServices.length > 1 && (
                      <p className="font-semibold text-gm-primary">
                        Total: {formatCurrency(selectedTotal)}
                      </p>
                    )}
                  </div>
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
