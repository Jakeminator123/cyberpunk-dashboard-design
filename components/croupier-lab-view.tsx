"use client"

import { FormEvent, ReactNode, useEffect, useState } from "react"
import {
  AlertCircle,
  ExternalLink,
  FlaskConical,
  GitBranch,
  MonitorUp,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react"

import { ScoutLogo } from "@/components/scout-logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const repositoryUrl = "https://gitlab.com/scout-gg/croupier"
const repositoryName = "scout-gg/croupier"
const sourceBranch = "jakeminator123/work"
const sourceCommit = "94a268837538e656376dcfd2afd64199a6ca8310"

function normalizedLabUrl(value: string) {
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `http://${value}`
  const url = new URL(candidate)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Ange en http- eller https-adress.")
  }

  return url.href.replace(/\/$/, "")
}

function isMixedContent(url: string) {
  return window.location.protocol === "https:" && url.startsWith("http:")
}

type FrameState = "idle" | "loading" | "attached"

interface CroupierLabViewProps {
  children?: ReactNode
  defaultUrl?: string
}

const brandSwatches = [
  { name: "ink", hex: "#0A0B0D", className: "bg-scout-ink", note: "Bakgrund. Allt står på ink." },
  { name: "off", hex: "#F2F1ED", className: "bg-scout-off", note: "Text och wordmark. Aldrig ren vit." },
  { name: "lime", hex: "#D6FF3A", className: "bg-scout-lime", note: "Enda accenten: snedstrecket, aktiva val, status." },
  { name: "steel", hex: "#5A6470", className: "bg-scout-steel", note: "Sekundär text, etiketter, ramar." },
] as const

export function CroupierLabView({
  children,
  defaultUrl = "http://127.0.0.1:4188",
}: CroupierLabViewProps) {
  const [labUrl, setLabUrl] = useState(defaultUrl)
  const [openUrl, setOpenUrl] = useState(defaultUrl)
  const [frameUrl, setFrameUrl] = useState<string | null>(null)
  const [frameState, setFrameState] = useState<FrameState>("idle")
  const [frameKey, setFrameKey] = useState(0)
  const [urlError, setUrlError] = useState("")
  const [mixedContentBlocked, setMixedContentBlocked] = useState(false)

  useEffect(() => {
    if (children) return
    setMixedContentBlocked(isMixedContent(defaultUrl))
  }, [children, defaultUrl])

  function connect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const nextUrl = normalizedLabUrl(labUrl.trim())
      const blocked = isMixedContent(nextUrl)
      setLabUrl(nextUrl)
      setOpenUrl(nextUrl)
      setUrlError("")
      setMixedContentBlocked(blocked)

      if (blocked) {
        setFrameUrl(null)
        setFrameState("idle")
        return
      }

      setFrameUrl(nextUrl)
      setFrameState("loading")
      setFrameKey((current) => current + 1)
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : "Adressen kunde inte läsas.")
    }
  }

  function reloadFrame() {
    if (!frameUrl) return
    setFrameState("loading")
    setFrameKey((current) => current + 1)
  }

  const activeUrl = frameUrl ?? openUrl
  const viewIsLive = Boolean(children) || frameState === "attached"

  return (
    <section className="relative flex min-h-full flex-col" aria-labelledby="lab-view-title">
      {/* Lime glow in the top-right corner, like the hero on scoutgaminggroup.com */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-scout-lime/10 blur-3xl animate-glow-pulse"
      />

      <header className="stagger relative flex flex-col gap-5 border-b border-scout-off/10 px-5 py-6 xl:flex-row xl:items-center xl:justify-between xl:px-7">
        <div className="flex min-w-0 items-start gap-4 animate-reveal-up" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-scout-lime/30 bg-scout-lime/10 text-scout-lime">
            <FlaskConical aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-scout-lime">
              {"// local view bridge · source-owned"}
            </p>
            <h1 id="lab-view-title" className="font-display text-3xl font-bold tracking-[-0.03em] text-scout-off">
              Croupier Studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-scout-steel">
              Visar den riktiga lokala Studio-vyn utan att kopiera labbkoden. GitLab-branchen förblir källa för UI, data och beteende.
            </p>
          </div>
        </div>

        <div className="grid shrink-0 gap-2 font-mono text-xs animate-reveal-up sm:grid-cols-2" style={{ "--i": 2 } as React.CSSProperties}>
          <a
            href={`${repositoryUrl}/-/tree/${encodeURIComponent(sourceBranch)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-scout-off/15 bg-scout-ink px-3 py-2 text-scout-off/80 transition-colors hover:border-scout-lime/50 hover:text-scout-lime"
          >
            <GitBranch aria-hidden="true" className="size-3.5" />
            <span className="max-w-44 truncate">{sourceBranch}</span>
          </a>
          <a
            href={`${repositoryUrl}/-/commit/${sourceCommit}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-scout-off/15 bg-scout-ink px-3 py-2 text-scout-off/80 transition-colors hover:border-scout-lime/50 hover:text-scout-lime"
          >
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            <span>HEAD {sourceCommit.slice(0, 8)}</span>
          </a>
        </div>
      </header>

      {!children && (
        <form
          className="relative grid gap-4 border-b border-scout-off/10 bg-scout-ink/60 px-5 py-4 backdrop-blur lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-end xl:px-7"
          onSubmit={connect}
        >
          <Field data-invalid={Boolean(urlError)}>
            <FieldLabel htmlFor="croupier-lab-url" className="font-mono text-[11px] uppercase tracking-[0.18em] text-scout-steel">
              {"// lokal labbadress"}
            </FieldLabel>
            <Input
              id="croupier-lab-url"
              value={labUrl}
              onChange={(event) => setLabUrl(event.target.value)}
              aria-invalid={Boolean(urlError)}
              spellCheck={false}
              placeholder="http://127.0.0.1:4188"
              className="border-scout-off/15 bg-scout-ink font-mono text-scout-off focus-visible:ring-scout-lime"
            />
            <FieldDescription className="text-xs text-scout-steel">
              Standardadressen kommer från repots <code>Start-Labb.ps1</code>. Ingen GitLab-kod eller hemlighet kopieras hit.
            </FieldDescription>
            {urlError && <p className="text-xs text-red-300">{urlError}</p>}
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" className="bg-scout-lime font-display font-semibold text-scout-ink hover:bg-scout-lime-deep">
              <PlugZap data-icon="inline-start" aria-hidden="true" />
              Visa labbet
            </Button>
            <Button type="button" variant="outline" onClick={reloadFrame} disabled={!frameUrl} className="border-scout-off/15 bg-scout-ink">
              <RefreshCw data-icon="inline-start" aria-hidden="true" />
              Ladda om
            </Button>
            <Button asChild variant="outline" className="border-scout-off/15 bg-scout-ink">
              <a href={activeUrl} target="_blank" rel="noreferrer">
                <ExternalLink data-icon="inline-start" aria-hidden="true" />
                Egen flik
              </a>
            </Button>
          </div>
        </form>
      )}

      {mixedContentBlocked && !children && (
        <div className="relative px-5 pt-5 xl:px-7">
          <Alert className="border-scout-lime/30 bg-scout-lime/5 text-scout-off">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>Den säkra förhandsvisningen kan inte bädda in en lokal HTTP-server</AlertTitle>
            <AlertDescription className="text-scout-off/70">
              Det är en webbläsarspärr, inte ett fel i labbet. Efter nedladdning fungerar bryggan när dashboarden och labbet körs lokalt över HTTP. Knappen Egen flik kan användas redan nu om labbet körs på din dator.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-5 xl:p-7">
        {/* The "monitor": a perspective stage with a tilted card that flattens when the view is live or on hover */}
        <div className="perspective-1400 flex flex-1 animate-reveal-3d">
          <div
            data-flat={viewIsLive}
            className={cn(
              "tilt-card preserve-3d relative flex min-h-[680px] flex-1 overflow-hidden rounded-lg border bg-scout-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] [--tilt-x:4deg] [--tilt-y:-2deg]",
              viewIsLive ? "border-scout-lime/40 shadow-[0_0_80px_-30px_rgba(214,255,58,0.45)]" : "border-scout-off/15",
            )}
          >
            {/* Scan line only while nothing live is attached */}
            {!viewIsLive && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-scout-lime/10 to-transparent animate-scan"
              />
            )}

            {children ? (
              <div className="size-full min-h-[680px] overflow-auto">{children}</div>
            ) : frameUrl && !mixedContentBlocked ? (
              <>
                <iframe
                  key={`${frameUrl}-${frameKey}`}
                  src={frameUrl}
                  title="Croupier Studio från det lokala labbet"
                  className="size-full min-h-[680px] border-0 bg-[#0c1015]"
                  referrerPolicy="no-referrer"
                  onLoad={() => setFrameState("attached")}
                />
                <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-md border border-scout-off/15 bg-scout-ink/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-scout-off backdrop-blur">
                  <span className={cn("size-1.5 rounded-full", frameState === "attached" ? "bg-scout-lime" : "animate-glow-pulse bg-scout-lime-deep")} />
                  {frameState === "attached" ? "view attached" : "loading local view"}
                </div>
              </>
            ) : (
              <div className="scout-grid m-auto w-full px-6 py-12 animate-grid-drift">
                <div className="mx-auto max-w-4xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-8 flex size-16 items-center justify-center rounded-lg border border-scout-off/15 bg-scout-steel-deep text-scout-lime">
                      <MonitorUp aria-hidden="true" className="size-7" />
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-scout-lime">{"// local studio mount"}</p>
                    <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-scout-off">
                      Den exakta labbvyn, inte en kopia
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-scout-steel">
                      Bryggan monterar Croupier Studio från den lokala servern. Ändringar i <code>lab/components/studio.tsx</code> syns därför direkt här.
                    </p>
                  </div>

                  <ol className="stagger mt-10 grid gap-3 md:grid-cols-3">
                    {[
                      { title: "Starta repot", copy: "Dubbelklicka Start-Labb.cmd i Croupier-repots rot." },
                      { title: "Kontrollera adressen", copy: "Labbet ska svara på 127.0.0.1:4188." },
                      { title: "Montera vyn", copy: "Tryck Visa labbet eller öppna det i en egen flik." },
                    ].map((step, index) => (
                      <li
                        key={step.title}
                        style={{ "--i": index + 3 } as React.CSSProperties}
                        className="perspective-1400 animate-reveal-up"
                      >
                        <div className="tilt-card h-full rounded-md border border-scout-off/10 bg-scout-ink/80 p-4 backdrop-blur [--tilt-x:4deg] [--tilt-y:-3deg]">
                          <div className="mb-4 flex items-center justify-between text-scout-lime">
                            <TerminalSquare aria-hidden="true" className="size-4" />
                            <span className="font-mono text-xs">0{index + 1}</span>
                          </div>
                          <h3 className="font-display text-sm font-semibold text-scout-off">{step.title}</h3>
                          <p className="mt-2 text-xs leading-5 text-scout-steel">{step.copy}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* Brand anatomy: teaches the logo + palette so the dashboard can be re-skinned consistently */}
                  <section
                    aria-labelledby="brand-anatomy-title"
                    className="mt-10 grid gap-6 rounded-lg border border-scout-off/10 bg-scout-ink/80 p-6 backdrop-blur lg:grid-cols-[1.1fr_1fr] lg:items-center"
                  >
                    <div className="flex flex-col gap-4">
                      <p id="brand-anatomy-title" className="font-mono text-[11px] uppercase tracking-[0.22em] text-scout-steel">
                        {"// brand anatomy"}
                      </p>
                      <ScoutLogo size="lg" tagline="The fantasy layer your sportsbook is missing" />
                      <p className="max-w-md text-xs leading-5 text-scout-steel">
                        Wordmarket är två off-white ord och ett lime snedstreck. Snedstrecket är enda accenten och därför det enda som
                        får vara i 3D och animeras. Komponenten ligger i <code>components/scout-logo.tsx</code> och kan sättas till{" "}
                        <code>animated={"{false}"}</code> för statiska sammanhang.
                      </p>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {brandSwatches.map((swatch) => (
                        <li key={swatch.name} className="flex items-start gap-3 rounded-md border border-scout-off/10 p-3">
                          <span aria-hidden="true" className={cn("mt-0.5 size-8 shrink-0 rounded border border-scout-off/15", swatch.className)} />
                          <div className="min-w-0">
                            <div className="flex items-baseline justify-between gap-2 font-mono text-xs">
                              <span className="text-scout-off">{swatch.name}</span>
                              <span className="text-scout-steel">{swatch.hex}</span>
                            </div>
                            <p className="mt-1 text-[11px] leading-4 text-scout-steel">{swatch.note}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="relative z-10 flex flex-col gap-2 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-scout-steel sm:flex-row sm:items-center sm:justify-between">
          <span>{repositoryName} · {sourceBranch}</span>
          <span>Direkt React-mount stöds genom komponentens children-slot</span>
        </footer>
      </div>
    </section>
  )
}
