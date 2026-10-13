import {
  CalendarBlankIcon,
  ChartLineUpIcon,
  ChatsCircleIcon,
  GearIcon,
  HouseIcon,
  KanbanIcon,
  PlusCircleIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import { type ComponentType, lazy } from "react"

// React Router navigates inside startTransition, so an unloaded chunk freezes the old page instead of showing
// the Suspense fallback. Preloading every page after startup makes navigation instant.
function page(load: () => Promise<{ default: ComponentType }>) {
  return Object.assign(lazy(load), { preload: load })
}

export const PAGES = [
  { id: "overview", title: "Overview", group: "Workspace", icon: HouseIcon, Component: page(() => import("./pages/overview")) },
  { id: "analytics", title: "Analytics", group: "Workspace", icon: ChartLineUpIcon, Component: page(() => import("./pages/analytics")) },
  { id: "clients", title: "Clients", group: "Workspace", icon: UsersIcon, badge: "248", Component: page(() => import("./pages/clients")) },
  { id: "projects", title: "Projects", group: "Delivery", icon: KanbanIcon, Component: page(() => import("./pages/projects")) },
  { id: "planning", title: "Planning", group: "Delivery", icon: CalendarBlankIcon, Component: page(() => import("./pages/planning")) },
  { id: "inbox", title: "Inbox", group: "Delivery", icon: ChatsCircleIcon, badge: "3", Component: page(() => import("./pages/inbox")) },
  { id: "new-mission", title: "New mission", group: "Delivery", icon: PlusCircleIcon, Component: page(() => import("./pages/new-mission")) },
  { id: "settings", title: "Settings", group: "Account", icon: GearIcon, Component: page(() => import("./pages/settings")) },
] as const

export type PageId = (typeof PAGES)[number]["id"]

export const preloadPages = () => PAGES.forEach((p) => p.Component.preload())
