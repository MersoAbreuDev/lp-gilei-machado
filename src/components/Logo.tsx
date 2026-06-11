import { BRAND } from "@/lib/brand";

type Props = {
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

export function Logo({ size = "md" }: Props) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-gm-gold to-gm-primary font-bold tracking-widest text-white shadow-sm ${SIZES[size]}`}
      aria-hidden
    >
      {BRAND.initials}
    </div>
  );
}
