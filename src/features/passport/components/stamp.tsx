import { LockIcon } from "lucide-react";
import { useId } from "react";

import { getT } from "@/i18n/server";
import { stampInk, stampRotation } from "@/lib/passport/stamps";

// Rubber stamp (docs/design/C-Passport): rings, curved text, and a rough edge from a displacement
// filter. Ink colour and tilt are fixed per district; colours come from the --stamp-N theme tokens.

const dateFormat = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "short" });

export function Stamp({
  districtId,
  name,
  date,
  kind = "visit",
  size = 104,
  animate = false,
}: {
  districtId: number;
  name: string;
  date: Date;
  kind?: "visit" | "discoverer";
  size?: number;
  animate?: boolean;
}) {
  const t = getT();
  const id = useId();
  const top = `${id}-top`;
  const bottom = `${id}-bottom`;
  const filter = `${id}-rough`;
  const label = kind === "discoverer" ? t("reward.discovererStamp") : t("reward.passportTitle");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={t("reward.stampOf", { district: name })}
      className={animate ? "animate-stamp-thump" : undefined}
      style={{
        color: `var(--stamp-${stampInk(districtId)})`,
        rotate: `${stampRotation(districtId)}deg`,
      }}
    >
      <defs>
        <filter id={filter} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={districtId}
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" />
        </filter>
        <path id={top} d="M17,50 A33,33 0 0,1 83,50" />
        <path id={bottom} d="M11,50 A39,39 0 0,0 89,50" />
      </defs>
      <g filter={`url(#${filter})`} fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="47" strokeWidth="3" />
        <circle cx="50" cy="50" r="43" strokeWidth="1" />
        <circle cx="50" cy="50" r="25" strokeWidth="1.5" />
        <text fill="currentColor" stroke="none" fontSize="9" fontWeight="600">
          <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
            {t("reward.passportTitle")}
          </textPath>
        </text>
        <text fill="currentColor" stroke="none" fontSize="9.5" fontWeight="600">
          <textPath href={`#${bottom}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
        <text
          x="50"
          y="54"
          fill="currentColor"
          stroke="none"
          fontSize="12.5"
          fontWeight="700"
          textAnchor="middle"
        >
          {name}
        </text>
        <text x="50" y="66" fill="currentColor" stroke="none" fontSize="7" textAnchor="middle">
          {dateFormat.format(date)}
        </text>
      </g>
    </svg>
  );
}

/** A district not yet unlocked: dashed circle with a lock. */
export function LockedStamp({ name, size = 88 }: { name: string; size?: number }) {
  const t = getT();
  return (
    <span
      role="img"
      aria-label={`${name}: ${t("reward.locked")}`}
      className="flex flex-col items-center justify-center gap-0.5 rounded-full border-2 border-dashed border-border text-muted-foreground"
      style={{ width: size, height: size }}
    >
      <LockIcon className="size-[18px]" aria-hidden />
      <span className="font-display text-sm font-semibold">{name}</span>
    </span>
  );
}
