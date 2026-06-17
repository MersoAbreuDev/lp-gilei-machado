/**
 * Formata tempo estimado do catálogo para exibição em hora/min.
 * Valores numéricos: até 9 → horas; 10–59 → minutos; 60+ → horas + minutos.
 */
export function formatEstimatedTime(
  raw: string | null | undefined,
): string | null {
  const text = raw?.trim();
  if (!text) return null;

  if (/[hH]|hora|min/i.test(text)) {
    return normalizeEstimatedTimeText(text);
  }

  const digits = text.replace(/\D/g, "");
  if (!digits) return text;

  const total = Number.parseInt(digits, 10);
  if (!Number.isFinite(total) || total <= 0) return text;

  if (total >= 60) {
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    if (minutes === 0) return `${hours}h`;
    if (hours === 0) return `${minutes} min`;
    return `${hours}h ${minutes} min`;
  }

  if (total <= 9) {
    return `${total}h`;
  }

  return `${total} min`;
}

function normalizeEstimatedTimeText(text: string): string {
  const hoursMatch = text.match(/(\d+)\s*(?:h|horas?)/i);
  const minutesMatch = text.match(/(\d+)\s*(?:min(?:utos?)?)/i);

  const hours = hoursMatch ? Number.parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? Number.parseInt(minutesMatch[1], 10) : 0;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes} min`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes} min`;
  return text;
}

export function formatEstimatedTimeLabel(
  raw: string | null | undefined,
): string | null {
  const formatted = formatEstimatedTime(raw);
  return formatted ? `Duração: ${formatted}` : null;
}
