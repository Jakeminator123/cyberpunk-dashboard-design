import { cn } from "@/lib/utils"

/**
 * scout/gaming wordmark.
 *
 * Anatomy (matches the official logo):
 *   "scout"  – off-white (#F2F1ED), bold display face, tight tracking
 *   "/"      – lime (#D6FF3A). This is the only accent: the slash is the brand.
 *   "gaming" – off-white, same weight as "scout"
 *
 * The slash is a real 3D element: it rotates around its Y-axis and moves forward on Z,
 * so it reads like a physical blade rather than a colored character. Set animated={false}
 * for a static mark (print, favicons, screenshots).
 */

type LogoSize = "sm" | "md" | "lg" | "xl"

const sizeClasses: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-5xl",
  xl: "text-7xl sm:text-8xl",
}

interface ScoutLogoProps {
  size?: LogoSize
  animated?: boolean
  tagline?: string
  className?: string
}

export function ScoutLogo({ size = "md", animated = true, tagline, className }: ScoutLogoProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "inline-flex items-baseline font-display font-bold leading-none tracking-[-0.04em] text-scout-off",
          sizeClasses[size],
        )}
        aria-label="scout/gaming"
      >
        <span aria-hidden="true">scout</span>
        <span aria-hidden="true" className="perspective-1400 inline-block">
          <span
            className={cn(
              "preserve-3d inline-block text-scout-lime drop-shadow-[0_0_12px_rgba(214,255,58,0.55)]",
              animated && "animate-slash-swing",
            )}
          >
            /
          </span>
        </span>
        <span aria-hidden="true">gaming</span>
      </span>
      {tagline && (
        <span className="mt-2 font-display text-sm font-medium text-scout-steel sm:text-base">{tagline}</span>
      )}
    </div>
  )
}

/** Compact square mark for collapsed sidebars and favicons: just the lime slash on ink. */
export function ScoutMark({ className }: { className?: string }) {
  return (
    <span
      aria-label="scout/gaming"
      className={cn(
        "perspective-1400 inline-flex size-9 items-center justify-center rounded-md border border-scout-off/15 bg-scout-steel-deep font-display text-2xl font-bold text-scout-lime",
        className,
      )}
    >
      <span aria-hidden="true" className="preserve-3d inline-block animate-slash-swing">
        /
      </span>
    </span>
  )
}
