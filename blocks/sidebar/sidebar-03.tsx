import {
  CaretRightIcon,
  ChartLineIcon,
  GearIcon,
  TrayIcon,
} from "@phosphor-icons/react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@diametral/design-system/react"

const REPORTS = ["Traffic", "Conversion", "Retention"]

export default function Sidebar03() {
  return (
    <SidebarProvider className="ds-block-sidebar-03">
      <Sidebar collapsible="none" className="ds-block-sidebar-03__sidebar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible defaultOpen render={<SidebarMenuItem />}>
                <SidebarMenuButton
                  isActive
                  render={<CollapsibleTrigger />}
                  className="ds-block-sidebar-03__trigger"
                >
                  <ChartLineIcon /> Reports
                  <CaretRightIcon className="ds-block-sidebar-03__caret" />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {REPORTS.map((report) => (
                      <SidebarMenuSubItem key={report}>
                        <SidebarMenuSubButton
                          href="#sidebar-03"
                          isActive={report === "Traffic"}
                        >
                          {report}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
              <Collapsible render={<SidebarMenuItem />}>
                <SidebarMenuButton
                  render={<CollapsibleTrigger />}
                  className="ds-block-sidebar-03__trigger"
                >
                  <GearIcon /> Settings
                  <CaretRightIcon className="ds-block-sidebar-03__caret" />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#sidebar-03">
                        Members
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <TrayIcon /> Inbox
                </SidebarMenuButton>
                {/* Counts live in the badge, never in the label text. */}
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="ds-block-sidebar-03__inset">
        <p className="ds-block-sidebar-03__lede">
          Traffic — 24 180 sessions this week.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
