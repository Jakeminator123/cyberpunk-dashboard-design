"use client"

import { useState } from "react"
import { Bell, ChevronRight, FlaskConical, Monitor, RefreshCw, Settings, Shield, Target, Users } from "lucide-react"

import { CroupierLabView } from "@/components/croupier-lab-view"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import AgentNetworkPage from "./agent-network/page"
import CommandCenterPage from "./command-center/page"
import IntelligencePage from "./intelligence/page"
import OperationsPage from "./operations/page"
import SystemsPage from "./systems/page"

const sections = [
  { id: "overview", icon: Monitor, label: "COMMAND CENTER" },
  { id: "lab", icon: FlaskConical, label: "CROUPIER LAB" },
  { id: "agents", icon: Users, label: "AGENT NETWORK" },
  { id: "operations", icon: Target, label: "OPERATIONS" },
  { id: "intelligence", icon: Shield, label: "INTELLIGENCE" },
  { id: "systems", icon: Settings, label: "SYSTEMS" },
] as const

type SectionId = (typeof sections)[number]["id"]

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState<SectionId>("lab")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const activeLabel = sections.find((section) => section.id === activeSection)?.label ?? "COMMAND CENTER"

  return (
    <div className="flex h-dvh bg-neutral-950">
      <aside
        className={cn(
          "fixed z-50 h-full border-r border-neutral-700 bg-neutral-900 transition-[width] duration-300 md:relative md:z-auto md:h-auto",
          sidebarCollapsed ? "w-16" : "w-72",
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center justify-between gap-2">
            <div className={cn(sidebarCollapsed && "hidden")}>
              <h1 className="text-lg font-bold tracking-wider text-orange-500">CROUPIER OPS</h1>
              <p className="text-xs text-neutral-500">LOCAL LAB BRIDGE</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={sidebarCollapsed ? "Expandera sidomenyn" : "Fäll ihop sidomenyn"}
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                aria-hidden="true"
                className={cn("transition-transform", !sidebarCollapsed && "rotate-180")}
              />
            </Button>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Dashboardsektioner">
            {sections.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={activeSection === item.id ? "page" : undefined}
                aria-label={sidebarCollapsed ? item.label : undefined}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded p-3 text-left transition-colors",
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                )}
              >
                <item.icon aria-hidden="true" className="size-5 shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-auto rounded border border-neutral-700 bg-neutral-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-orange-400" />
                <span className="text-xs text-white">WORKSPACE READY</span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-neutral-500">
                <span>LAB: 127.0.0.1:4188</span>
                <span>BRANCH: JAKEMINATOR123/WORK</span>
                <span>HEAD: 94A26883</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {!sidebarCollapsed && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Stäng sidomenyn"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-700 bg-neutral-800 px-4 sm:px-6">
          <div className="truncate text-xs text-neutral-400 sm:text-sm">
            CROUPIER OPERATIONS / <span className="text-orange-500">{activeLabel}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-xs text-neutral-500 xl:block">
              SOURCE: JAKEMINATOR123/WORK · 94A26883
            </div>
            <Button variant="ghost" size="icon" aria-label="Visa notiser" className="text-neutral-400 hover:text-orange-500">
              <Bell aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Uppdatera dashboarden" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">
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
