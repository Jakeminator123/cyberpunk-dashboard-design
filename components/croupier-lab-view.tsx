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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

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

  return (
    <section className="flex min-h-full flex-col bg-neutral-950" aria-labelledby="lab-view-title">
      <header className="flex flex-col gap-5 border-b border-neutral-800 bg-neutral-900/80 px-5 py-5 xl:flex-row xl:items-center xl:justify-between xl:px-7">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <FlaskConical aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-orange-500/40 text-orange-400">
                LOCAL VIEW BRIDGE
              </Badge>
              <Badge variant="secondary">SOURCE-OWNED</Badge>
            </div>
            <h1 id="lab-view-title" className="text-xl font-semibold tracking-tight text-white">
              Croupier Studio
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-400">
              Visar den riktiga lokala Studio-vyn utan att kopiera labbkoden. GitLab-branchen förblir källa för UI, data och beteende.
            </p>
          </div>
        </div>

        <div className="grid shrink-0 gap-2 text-xs sm:grid-cols-2">
          <a
            href={`${repositoryUrl}/-/tree/${encodeURIComponent(sourceBranch)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-300 transition-colors hover:border-orange-500/40 hover:text-white"
          >
            <GitBranch aria-hidden="true" className="size-3.5" />
            <span className="max-w-44 truncate">{sourceBranch}</span>
          </a>
          <a
            href={`${repositoryUrl}/-/commit/${sourceCommit}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-300 transition-colors hover:border-orange-500/40 hover:text-white"
          >
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            <span>HEAD {sourceCommit.slice(0, 8)}</span>
          </a>
        </div>
      </header>

      {!children && (
        <form
          className="grid gap-4 border-b border-neutral-800 bg-neutral-900 px-5 py-4 lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-end xl:px-7"
          onSubmit={connect}
        >
          <Field data-invalid={Boolean(urlError)}>
            <FieldLabel htmlFor="croupier-lab-url" className="text-neutral-300">
              Lokal labbadress
            </FieldLabel>
            <Input
              id="croupier-lab-url"
              value={labUrl}
              onChange={(event) => setLabUrl(event.target.value)}
              aria-invalid={Boolean(urlError)}
              spellCheck={false}
              placeholder="http://127.0.0.1:4188"
              className="border-neutral-700 bg-neutral-950 font-mono text-neutral-100"
            />
            <FieldDescription className="text-xs text-neutral-500">
              Standardadressen kommer från repots <code>Start-Labb.ps1</code>. Ingen GitLab-kod eller hemlighet kopieras hit.
            </FieldDescription>
            {urlError && <p className="text-xs text-red-400">{urlError}</p>}
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-400">
              <PlugZap data-icon="inline-start" aria-hidden="true" />
              Visa labbet
            </Button>
            <Button type="button" variant="outline" onClick={reloadFrame} disabled={!frameUrl} className="border-neutral-700 bg-neutral-950">
              <RefreshCw data-icon="inline-start" aria-hidden="true" />
              Ladda om
            </Button>
            <Button asChild variant="outline" className="border-neutral-700 bg-neutral-950">
              <a href={activeUrl} target="_blank" rel="noreferrer">
                <ExternalLink data-icon="inline-start" aria-hidden="true" />
                Egen flik
              </a>
            </Button>
          </div>
        </form>
      )}

      {mixedContentBlocked && !children && (
        <div className="px-5 pt-5 xl:px-7">
          <Alert className="border-amber-500/30 bg-amber-500/5 text-amber-100">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>Den säkra förhandsvisningen kan inte bädda in en lokal HTTP-server</AlertTitle>
            <AlertDescription className="text-amber-100/70">
              Det är en webbläsarspärr, inte ett fel i labbet. Efter nedladdning fungerar bryggan när dashboarden och labbet körs lokalt över HTTP. Knappen Egen flik kan användas redan nu om labbet körs på din dator.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 xl:p-7">
        <div className="relative flex min-h-[680px] flex-1 overflow-hidden rounded-lg border border-neutral-700 bg-black shadow-2xl shadow-black/40">
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
              <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950/90 px-2.5 py-1.5 text-[10px] font-medium tracking-wider text-neutral-300 backdrop-blur">
                <span className={frameState === "attached" ? "size-1.5 rounded-full bg-emerald-400" : "size-1.5 animate-pulse rounded-full bg-orange-400"} />
                {frameState === "attached" ? "VIEW ATTACHED" : "LOADING LOCAL VIEW"}
              </div>
            </>
          ) : (
            <div className="m-auto w-full max-w-3xl px-6 py-12">
              <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 text-orange-400">
                <MonitorUp aria-hidden="true" className="size-7" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium tracking-[0.22em] text-orange-400">LOCAL STUDIO MOUNT</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Den exakta labbvyn, inte en kopia</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-400">
                  Bryggan monterar Croupier Studio från den lokala servern. Ändringar i <code>lab/components/studio.tsx</code> syns därför direkt här.
                </p>
              </div>

              <ol className="mt-9 grid gap-3 md:grid-cols-3">
                {[
                  { title: "Starta repot", copy: "Dubbelklicka Start-Labb.cmd i Croupier-repots rot." },
                  { title: "Kontrollera adressen", copy: "Labbet ska svara på 127.0.0.1:4188." },
                  { title: "Montera vyn", copy: "Tryck Visa labbet eller öppna det i en egen flik." },
                ].map((step, index) => (
                  <li key={step.title} className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
                    <div className="mb-4 flex items-center justify-between text-orange-400">
                      <TerminalSquare aria-hidden="true" className="size-4" />
                      <span className="font-mono text-xs">0{index + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium text-white">{step.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-neutral-500">{step.copy}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-2 pt-3 text-[10px] tracking-wide text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <span>{repositoryName} · {sourceBranch}</span>
          <span>Direkt React-mount stöds genom komponentens children-slot</span>
        </footer>
      </div>
    </section>
  )
}
