import { BRAND } from "@/lib/brand";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZES = {
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  xl: "h-36 sm:h-44",
};

export function Logo({ size = "md", className = "" }: Props) {
  return (
    <img
      src={BRAND.logoUrl}
      alt={BRAND.name}
      className={`w-auto object-contain ${SIZES[size]} ${className}`.trim()}
    />
  );
}
