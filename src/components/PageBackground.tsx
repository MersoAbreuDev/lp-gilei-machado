import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

type Props = {
  children: ReactNode;
};

export function PageBackground({ children }: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-gm-canvas">
      <div className="bg-decor" aria-hidden>
        <img
          src={BRAND.bgHandUrl}
          alt=""
          className="bg-decor-hand"
          loading="eager"
          draggable={false}
        />
        <img
          src={BRAND.bgPolishUrl}
          alt=""
          className="bg-decor-polish"
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
    </div>
  );
}
