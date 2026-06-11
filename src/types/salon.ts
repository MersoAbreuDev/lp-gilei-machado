export type PublicSalonInfo = {
  organizationName: string;
  slug: string;
  segment: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  serviceProvider: { id: string; name: string } | null;
};

export type PublicSalonService = {
  id: string;
  name: string;
  description: string;
  value: number;
  category: string | null;
  estimatedTime: string | null;
};

export type PublicSalonSlot = {
  startsAt: string;
  endsAt: string;
  label: string;
  available: boolean;
  hm: string;
  weekday: number;
};

export type PublicSalonSlotsResponse = {
  organizationName: string;
  slug: string;
  schedule: {
    weeksAhead: number;
    slotMinutes: number;
    days: Array<{ weekday: number; startTime: string; endTime: string }>;
  } | null;
  scheduleText: string;
  slots: PublicSalonSlot[];
  slotsByWeekday: Record<string, PublicSalonSlot[]>;
};
