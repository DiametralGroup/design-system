import {
  CaretUpDownIcon,
  ChartLineIcon,
  DotsThreeIcon,
  FilesIcon,
  UsersIcon,
} from "@phosphor-icons/react"

import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@diametral/design-system/react"

const WORKSPACE = [
  { title: "Dashboard", icon: ChartLineIcon, active: true, count: null },
  { title: "Documents", icon: FilesIcon, active: false, count: "24" },
  { title: "Members", icon: UsersIcon, active: false, count: "7" },
]

export default function AppShell01() {
  return (
    <SidebarProvider className="ds-block-app-shell-01">
      <Sidebar collapsible="none" className="ds-block-app-shell-01__sidebar">
        <SidebarHeader>
          <SidebarInput
            aria-label="Search the workspace"
            placeholder="Search…"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {WORKSPACE.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active}>
                      <item.icon /> {item.title}
                    </SidebarMenuButton>
                    {/* Badge and action share the end of the row, so the count
                        gives way to the menu on hover. */}
                    {item.count ? (
                      <SidebarMenuBadge className="ds-block-app-shell-01__badge">
                        {item.count}
                      </SidebarMenuBadge>
                    ) : null}
                    <SidebarMenuAction
                      showOnHover
                      aria-label={`Options for ${item.title}`}
                    >
                      <DotsThreeIcon />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="ds-block-app-shell-01__avatar">
                  <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                <span className="ds-flex ds-flex-col ds-block-app-shell-01__account">
                  <span className="ds-block-app-shell-01__truncate">Camille Roux</span>
                  <span className="ds-block-app-shell-01__email">
                    camille@diametral.fr
                  </span>
                </span>
                <CaretUpDownIcon className="ds-block-app-shell-01__caret" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="ds-block-app-shell-01__inset">
        <h1 className="ds-block-app-shell-01__title">
          Dashboard
        </h1>
        <p className="ds-block-app-shell-01__lede">
          Nine documents updated since Monday.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
