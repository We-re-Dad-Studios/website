import Image from "next/image";
import { BrandStripes } from "@/components/BrandStripes";

// Route-level loading screen. Brand-quiet on purpose: Mystical Indigo ground,
// the white logo, and a slash progress bar echoing the logo's cuts.
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-brand-indigo text-white"
    >
      <BrandStripes className="left-0 top-0 h-[260px] w-[110px] sm:h-[400px] sm:w-[180px]" />
      <BrandStripes className="bottom-0 right-0 h-[260px] w-[110px] rotate-180 sm:h-[400px] sm:w-[180px]" />

      <div className="relative flex flex-col items-center gap-7">
        <Image
          src="/images/wds-mark-white.svg"
          alt=""
          width={160}
          height={65}
          priority
          className="h-auto w-[128px] animate-pulse sm:w-[160px]"
        />

        {/* Slash bar: a band of diagonal stripes sliding through a track */}
        <div className="relative h-3 w-56 overflow-hidden bg-brand-indigo-deep">
          <div className="wds-slash-bar absolute inset-y-0 w-1/2" />
        </div>

        <span className="font-plaguard text-[22px] tracking-[0.12em]">LOADING</span>
        <span className="sr-only">Loading page</span>
      </div>

      <style>{`
        .wds-slash-bar {
          background: repeating-linear-gradient(
            -45deg,
            #F659DA 0 8px,
            transparent 8px 14px
          );
          animation: wds-slash 1.1s ease-in-out infinite;
        }
        @keyframes wds-slash {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(210%); }
        }
      `}</style>
    </div>
  );
}
