"use client"

import { useState } from "react"
import { Bell, ChevronRight, FlaskConical, Monitor, RefreshCw, Settings, Shield, Target, Users } from "lucide-react"

import { CroupierLabView } from "@/components/croupier-lab-view"
import { ScoutLogo, ScoutMark } from "@/components/scout-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import AgentNetworkPage from "./agent-network/page"
import CommandCenterPage from "./command-center/page"
import IntelligencePage from "./intelligence/page"
import OperationsPage from "./operations/page"
import SystemsPage from "./systems/page"

const sections = [
  { id: "lab", icon: FlaskConical, label: "CROUPIER LAB" },
  { id: "overview", icon: Monitor, label: "COMMAND CENTER" },
  { id: "agents", icon: Users, label: "AGENT NETWORK" },
  { id: "operations", icon: Target, label: "OPERATIONS" },
  { id: "intelligence", icon: Shield, label: "INTELLIGENCE" },
  { id: "systems", icon: Settings, label: "SYSTEMS" },
] as const

type SectionId = (typeof sections)[number]["id"]

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState<SectionId>("lab")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const activeLabel = sections.find((section) => section.id === activeSection)?.label ?? "CROUPIER LAB"

  return (
    <div className="flex h-dvh bg-scout-ink text-scout-off">
      <aside
        className={cn(
          "fixed z-50 h-full border-r border-scout-off/10 bg-scout-ink transition-[width] duration-300 md:relative md:z-auto md:h-auto",
          sidebarCollapsed ? "w-16" : "w-72",
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center justify-between gap-2">
            {sidebarCollapsed ? (
              <ScoutMark />
            ) : (
              <div className="animate-reveal-up">
                <ScoutLogo size="md" />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-scout-steel">{"// croupier ops"}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label={sidebarCollapsed ? "Expandera sidomenyn" : "Fäll ihop sidomenyn"}
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="text-scout-steel hover:text-scout-lime"
            >
              <ChevronRight aria-hidden="true" className={cn("transition-transform", !sidebarCollapsed && "rotate-180")} />
            </Button>
          </div>

          <nav className="stagger flex flex-col gap-1" aria-label="Dashboardsektioner">
            {sections.map((item, index) => (
              <button
                key={item.id}
                type="button"
                style={{ "--i": index } as React.CSSProperties}
                aria-current={activeSection === item.id ? "page" : undefined}
                aria-label={sidebarCollapsed ? item.label : undefined}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-md p-3 text-left font-display text-sm font-medium transition-all duration-300 animate-reveal-up",
                  activeSection === item.id
                    ? "bg-scout-lime text-scout-ink shadow-[0_0_28px_-6px_rgba(214,255,58,0.55)]"
                    : "text-scout-steel hover:bg-scout-steel-deep hover:text-scout-off",
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]"
                />
                {!sidebarCollapsed && <span className="tracking-wide">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="perspective-1400 mt-auto">
              <div className="tilt-card rounded-md border border-scout-off/10 bg-scout-steel-deep p-4 [--tilt-x:6deg] [--tilt-y:6deg]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="size-2 animate-glow-pulse rounded-full bg-scout-lime" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-scout-off">workspace ready</span>
                </div>
                <dl className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-wider text-scout-steel">
                  <div className="flex justify-between gap-2">
                    <dt>lab</dt>
                    <dd className="text-scout-off/80">127.0.0.1:4188</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>branch</dt>
                    <dd className="truncate text-scout-off/80">jakeminator123/work</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>head</dt>
                    <dd className="text-scout-lime">94a26883</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </aside>

      {!sidebarCollapsed && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-scout-ink/70 md:hidden"
          aria-label="Stäng sidomenyn"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-scout-off/10 bg-scout-ink px-4 sm:px-6">
          <div className="truncate font-mono text-[11px] uppercase tracking-[0.18em] text-scout-steel">
            {"// croupier operations · "}
            <span key={activeSection} className="inline-block animate-reveal-up text-scout-lime">
              {activeLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-scout-steel xl:block">
              source: jakeminator123/work · 94a26883
            </div>
            <Button variant="ghost" size="icon" aria-label="Visa notiser" className="text-scout-steel hover:text-scout-lime">
              <Bell aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Uppdatera dashboarden" className="text-scout-steel hover:text-scout-lime">
              <RefreshCw aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main key={activeSection} className="scout-grid min-h-0 flex-1 overflow-auto animate-reveal-up">
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "lab" && <CroupierLabView />}
          {activeSection === "agents" && <AgentNetworkPage />}
          {activeSection === "operations" && <OperationsPage />}
          {activeSection === "intelligence" && <IntelligencePage />}
          {activeSection === "systems" && <SystemsPage />}
        </main>
      </div>
    </div>
  )
}
