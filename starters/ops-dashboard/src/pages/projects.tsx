import {
  ArchiveIcon,
  BriefcaseIcon,
  CalendarPlusIcon,
  CaretDownIcon,
  ChartLineUpIcon,
  CopyIcon,
  FileDocIcon,
  FilePdfIcon,
  FileXlsIcon,
  FlowArrowIcon,
  FolderIcon,
  FolderOpenIcon,
  KanbanIcon,
  LightningIcon,
  PlusIcon,
  PresentationChartIcon,
  ReceiptIcon,
  TableIcon,
  UserPlusIcon,
} from "@phosphor-icons/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DropdownMenuItem,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Kanban,
  KanbanCardTitle,
  type KanbanColumn,
  Masonry,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderTabs,
  PageHeaderTitle,
  Progress,
  ProgressLabel,
  ProgressValue,
  Rating,
  SpeedDial,
  SpeedDialAction,
  SplitButton,
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Toc,
  TocItem,
  TocLabel,
  TocLink,
  TocList,
  Tree,
  TreeItem,
  TreeItemContent,
  TreeItemTrigger,
  TreeLeaf,
  toast,
} from "@diametral/design-system/react"
import { type ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router"

type Consultant = { name: string; role: string; rate: number; skills: string[] }

const CONSULTANTS: Record<string, Consultant> = {
  CR: { name: "Camille Roux", role: "Engagement manager", rate: 1150, skills: ["Strategy", "PMO"] },
  AM: { name: "Antoine Mercier", role: "Data architect", rate: 980, skills: ["dbt", "Snowflake"] },
  LB: { name: "Léa Bernard", role: "Product designer", rate: 850, skills: ["Research", "UI"] },
  NK: { name: "Nadia Kaci", role: "ML engineer", rate: 1020, skills: ["Python", "MLOps"] },
  TG: { name: "Thomas Girard", role: "Business analyst", rate: 720, skills: ["SQL", "Process"] },
}

const PHASES = [
  { title: "Scoping", description: "Needs, budget, SOW" },
  { title: "Discovery", description: "Interviews, audit" },
  { title: "Delivery", description: "Build and iterate" },
  { title: "Handover", description: "Training, PV signed" },
]

type Mission = {
  id: string
  column: string
  title: string
  client: string
  days: number
  rate: number
  team: string[]
  phase: number
  progress: number
  satisfaction: number
  priority: "High" | "Normal" | "Low"
}

const COLUMNS: KanbanColumn[] = [
  { id: "lead", title: "Lead" },
  { id: "proposal", title: "Proposal" },
  { id: "delivery", title: "In delivery" },
  { id: "closed", title: "Closed" },
]

const MISSIONS: Mission[] = [
  { id: "M-118", column: "lead", title: "Pricing engine audit", client: "Vauban Assurances", days: 25, rate: 1050, team: ["CR"], phase: 0, progress: 5, satisfaction: 0, priority: "Normal" },
  { id: "M-121", column: "lead", title: "Supply chain control tower", client: "Norelec", days: 60, rate: 990, team: ["CR", "TG"], phase: 0, progress: 0, satisfaction: 0, priority: "High" },
  { id: "M-114", column: "proposal", title: "Customer data platform", client: "Maison Lefort", days: 80, rate: 960, team: ["AM", "TG"], phase: 0, progress: 15, satisfaction: 0, priority: "High" },
  { id: "M-109", column: "delivery", title: "Churn prediction model", client: "Lumen SA", days: 45, rate: 1020, team: ["NK", "AM", "CR"], phase: 2, progress: 62, satisfaction: 4, priority: "High" },
  { id: "M-106", column: "delivery", title: "Field app redesign", client: "Groupe Arvor", days: 38, rate: 850, team: ["LB", "TG"], phase: 1, progress: 34, satisfaction: 5, priority: "Normal" },
  { id: "M-102", column: "closed", title: "Finance KPI dashboards", client: "Cèdre Capital", days: 30, rate: 900, team: ["AM", "LB", "TG", "CR"], phase: 3, progress: 100, satisfaction: 4, priority: "Low" },
]

const PRIORITY_TONE = { High: "danger", Normal: "info", Low: "neutral" } as const

const eur = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

function phaseState(index: number, current: number) {
  if (index < current) return "completed"
  if (index === current) return "active"
  return "inactive"
}

function ConsultantChip({ id }: { id: string }) {
  const c = CONSULTANTS[id]
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="ghost" size="sm" className="justify-start" />}>
        <Avatar size="sm">
          <AvatarFallback>{id}</AvatarFallback>
        </Avatar>
        {c.name}
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start">
        <div className="flex items-start gap-3">
          <Avatar size="lg">
            <AvatarFallback>{id}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider uppercase">{c.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.role} · {eur(c.rate)}/day
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function Team({ ids }: { ids: string[] }) {
  return (
    <AvatarGroup>
      {ids.slice(0, 3).map((id) => (
        <Avatar key={id} size="sm">
          <AvatarFallback>{id}</AvatarFallback>
        </Avatar>
      ))}
      {ids.length > 3 ? <AvatarGroupCount>+{ids.length - 3}</AvatarGroupCount> : null}
    </AvatarGroup>
  )
}

function MissionDrawer({
  mission,
  onClose,
  onChange,
}: {
  mission: Mission | undefined
  onClose: () => void
  onChange: (patch: Partial<Mission>) => void
}) {
  return (
    <Drawer open={!!mission} onOpenChange={(open) => !open && onClose()} swipeDirection="right">
      <DrawerContent>
        {mission ? (
          <>
            <DrawerHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{mission.id}</Badge>
                <Tag tone={PRIORITY_TONE[mission.priority]}>{mission.priority} priority</Tag>
              </div>
              <DrawerTitle>{mission.title}</DrawerTitle>
              <DrawerDescription>
                {mission.client} · {mission.days} days at {eur(mission.rate)} = {eur(mission.days * mission.rate)}
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Phase</h3>
                <Stepper orientation="vertical">
                  {PHASES.map((p, i) => (
                    <StepperItem key={p.title} state={phaseState(i, mission.phase)}>
                      <StepperIndicator>{i + 1}</StepperIndicator>
                      <StepperContent>
                        <StepperTitle>{p.title}</StepperTitle>
                        <StepperDescription>{p.description}</StepperDescription>
                      </StepperContent>
                      {i < PHASES.length - 1 && <StepperSeparator />}
                    </StepperItem>
                  ))}
                </Stepper>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={mission.phase === 0}
                    onClick={() => onChange({ phase: mission.phase - 1 })}
                  >
                    Previous phase
                  </Button>
                  <Button
                    size="sm"
                    disabled={mission.phase === PHASES.length - 1}
                    onClick={() => onChange({ phase: mission.phase + 1 })}
                  >
                    Advance phase
                  </Button>
                </div>
              </section>

              <Progress value={mission.progress}>
                <ProgressLabel>Days consumed</ProgressLabel>
                <ProgressValue />
              </Progress>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Client satisfaction
                </h3>
                <Rating
                  shape="star"
                  value={mission.satisfaction}
                  onValueChange={(satisfaction) => onChange({ satisfaction })}
                  aria-label="Client satisfaction"
                />
              </section>

              <section className="flex flex-col items-start gap-1">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Team</h3>
                {mission.team.map((id) => (
                  <ConsultantChip key={id} id={id} />
                ))}
              </section>

              <Accordion defaultValue={["scope"]}>
                <AccordionItem value="scope">
                  <AccordionTrigger>Scope</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Audit of the current stack, target architecture, and a first production release within the agreed
                    envelope of {mission.days} days.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="deliverables">
                  <AccordionTrigger>Deliverables</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Discovery report, roadmap deck, a working increment every two weeks, handover pack.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="risks">
                  <AccordionTrigger>Risks</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Data access still pending with the client IT team; sponsor change expected in Q4.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}

function BoardView() {
  const [missions, setMissions] = useState(MISSIONS)
  const [openId, setOpenId] = useState<string>()
  const open = missions.find((m) => m.id === openId)
  const active = missions.filter((m) => m.column !== "closed")
  const pipeline = active.reduce((sum, m) => sum + m.days * m.rate, 0)

  const patch = (id: string, change: Partial<Mission>) =>
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, ...change } : m)))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Open pipeline <span className="font-medium text-foreground tabular-nums">{eur(pipeline)}</span> across{" "}
        {active.length} missions. Drag a card by its grip to move it.
      </p>
      <div className="overflow-x-auto">
        <Kanban
          columns={COLUMNS}
          items={missions}
          onItemsChange={setMissions}
          onMove={(key, to) => {
            const title = COLUMNS.find((c) => c.id === to)?.title
            toast.add({ title: `${key} moved`, description: `Now in ${title}.` })
          }}
          className="min-w-[56rem]"
          renderCard={(m) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <KanbanCardTitle>{m.title}</KanbanCardTitle>
                <Tag tone={PRIORITY_TONE[m.priority]}>{m.priority}</Tag>
              </div>
              <span className="text-xs text-muted-foreground">
                {m.client} · {m.days} d × {eur(m.rate)}
              </span>
              <Progress value={m.progress} aria-label={`${m.title} progress`} />
              <div className="flex items-center justify-between gap-2">
                <Team ids={m.team} />
                <Button variant="ghost" size="xs" onClick={() => setOpenId(m.id)}>
                  Details
                </Button>
              </div>
            </div>
          )}
        />
      </div>
      <MissionDrawer mission={open} onClose={() => setOpenId(undefined)} onChange={(c) => open && patch(open.id, c)} />
    </div>
  )
}

const BRIEF = [
  { id: "brief-context", title: "Context", level: 1 as const },
  { id: "brief-objectives", title: "Objectives", level: 1 as const },
  { id: "brief-kpis", title: "Success KPIs", level: 2 as const },
  { id: "brief-approach", title: "Approach", level: 1 as const },
  { id: "brief-budget", title: "Budget", level: 1 as const },
]

const BRIEF_TEXT: Record<string, string> = {
  "brief-context":
    "Lumen SA loses roughly 14% of its B2B subscribers every year. Retention actions are triggered by account managers on gut feeling, with no shared view of risk. The data team owns a clean warehouse but no modelling capacity.",
  "brief-objectives":
    "Ship a churn score refreshed weekly for every active account, expose it in the CRM, and equip account managers with a short playbook per risk segment. The model must be explainable to non-technical staff.",
  "brief-kpis":
    "Precision above 0.7 on the top decile, CRM adoption by 80% of account managers within six weeks, and a measurable two-point reduction in churn after two quarters.",
  "brief-approach":
    "Two-week discovery with interviews and a data audit, then three delivery sprints. Each sprint ends with a demo to the sponsor. MLOps is set up from sprint one so the model reaches production without a rewrite.",
  "brief-budget":
    "45 days at a blended rate of €1,020, i.e. €45,900 excluding VAT, invoiced monthly on time spent. Travel is billed at cost with a cap of €2,000.",
}

const FOLDERS: { name: string; open?: boolean; files: { name: string; icon: ReactNode }[] }[] = [
  {
    name: "01 Scoping",
    files: [
      { name: "SOW-signed.pdf", icon: <FilePdfIcon /> },
      { name: "Kick-off.pptx", icon: <PresentationChartIcon /> },
    ],
  },
  {
    name: "02 Discovery",
    open: true,
    files: [
      { name: "Interview-notes.docx", icon: <FileDocIcon /> },
      { name: "Data-audit.xlsx", icon: <FileXlsIcon /> },
      { name: "Brief.docx", icon: <FileDocIcon /> },
    ],
  },
  {
    name: "03 Delivery",
    files: [
      { name: "Sprint-1-demo.pptx", icon: <PresentationChartIcon /> },
      { name: "Feature-list.xlsx", icon: <FileXlsIcon /> },
    ],
  },
  {
    name: "Invoices",
    files: [
      { name: "INV-2038.pdf", icon: <ReceiptIcon /> },
      { name: "INV-2044.pdf", icon: <ReceiptIcon /> },
    ],
  },
]

function FilesView() {
  const [active, setActive] = useState(BRIEF[0].id)

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
      <div className="flex flex-col gap-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle>M-109 · Churn prediction</CardTitle>
            <CardDescription>Lumen SA shared drive</CardDescription>
          </CardHeader>
          <CardContent>
            <Tree>
              {FOLDERS.map((folder) => (
                <TreeItem key={folder.name} defaultOpen={folder.open}>
                  <TreeItemTrigger>
                    <FolderOpenIcon className="hidden group-data-panel-open/tree-item-trigger:block" />
                    <FolderIcon className="group-data-panel-open/tree-item-trigger:hidden" />
                    {folder.name}
                  </TreeItemTrigger>
                  <TreeItemContent>
                    {folder.files.map((f) => (
                      <TreeLeaf key={f.name}>
                        {f.icon} {f.name}
                      </TreeLeaf>
                    ))}
                  </TreeItemContent>
                </TreeItem>
              ))}
            </Tree>
          </CardContent>
        </Card>

        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button variant="ghost" size="sm" className="group/collapsible w-full justify-between">
                <span className="flex items-center gap-2">
                  <ArchiveIcon /> Archive
                </span>
                <CaretDownIcon className="transition-transform group-aria-expanded/collapsible:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="mt-2">
            <Empty className="border border-dashed border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ArchiveIcon />
                </EmptyMedia>
                <EmptyTitle>Nothing archived</EmptyTitle>
                <EmptyDescription>Files move here once the handover PV is signed.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm" disabled>
                  Archive mission
                </Button>
              </EmptyContent>
            </Empty>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brief.docx</CardTitle>
          <CardDescription>Last edited by Camille Roux on 18 September</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row-reverse md:items-start">
          <Toc className="top-20 md:w-44">
            <TocLabel>In this brief</TocLabel>
            <TocList>
              {BRIEF.map((s) => (
                <TocItem key={s.id} level={s.level}>
                  <TocLink
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    aria-current={active === s.id ? "location" : undefined}
                    className="aria-[current]:border-foreground aria-[current]:text-foreground"
                  >
                    {s.title}
                  </TocLink>
                </TocItem>
              ))}
            </TocList>
          </Toc>
          <article className="flex min-w-0 flex-1 flex-col gap-6">
            {BRIEF.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-20">
                {s.level === 1 ? (
                  <h2 className="font-heading text-lg font-semibold">{s.title}</h2>
                ) : (
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                )}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{BRIEF_TEXT[s.id]}</p>
              </section>
            ))}
          </article>
        </CardContent>
      </Card>
    </div>
  )
}

const SLIDES = [
  { title: "Discovery report", meta: "PDF · 42 pages", icon: FileDocIcon, bg: "from-chart-1/30 to-chart-2/10" },
  { title: "Target architecture", meta: "Diagram · v3", icon: FlowArrowIcon, bg: "from-chart-2/30 to-chart-3/10" },
  { title: "Churn score dashboard", meta: "Dashboard · live", icon: ChartLineUpIcon, bg: "from-chart-3/30 to-chart-4/10" },
  { title: "Sprint 2 demo", meta: "Deck · 18 slides", icon: PresentationChartIcon, bg: "from-chart-4/30 to-chart-5/10" },
]

const GALLERY = [
  { title: "Retention playbook", client: "Lumen SA", ratio: 4 / 5, icon: FileDocIcon, tone: "success" as const, status: "Approved", score: 5 },
  { title: "KPI tree", client: "Cèdre Capital", ratio: 16 / 9, icon: TableIcon, tone: "info" as const, status: "In review", score: 4 },
  { title: "Field app wireframes", client: "Groupe Arvor", ratio: 3 / 4, icon: KanbanIcon, tone: "warning" as const, status: "Draft", score: 3 },
  { title: "Data model", client: "Maison Lefort", ratio: 1, icon: FlowArrowIcon, tone: "info" as const, status: "In review", score: 4 },
  { title: "Steering committee", client: "Lumen SA", ratio: 21 / 9, icon: PresentationChartIcon, tone: "success" as const, status: "Approved", score: 5 },
  { title: "Pricing audit memo", client: "Vauban Assurances", ratio: 4 / 3, icon: FilePdfIcon, tone: "neutral" as const, status: "Scheduled", score: 0 },
]

function GalleryView() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const update = () => setCurrent(api.selectedScrollSnap())
    update()
    api.on("select", update)
    return () => {
      api.off("select", update)
    }
  }, [api])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Latest deliverables</CardTitle>
          <CardDescription>
            {current + 1} of {SLIDES.length} · {SLIDES[current].title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel setApi={setApi} opts={{ align: "start" }}>
            <CarouselContent>
              {SLIDES.map((s) => (
                <CarouselItem key={s.title} className="md:basis-1/2 xl:basis-1/3">
                  <AspectRatio ratio={16 / 9} className={`border border-border bg-linear-to-br ${s.bg}`}>
                    <div className="flex size-full flex-col justify-between p-4">
                      <s.icon className="size-8 text-foreground" />
                      <div>
                        <p className="text-sm font-medium">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.meta}</p>
                      </div>
                    </div>
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      <Masonry columns={3} className="max-lg:columns-2 max-sm:columns-1">
        {GALLERY.map((g) => (
          <Card key={g.title} size="sm" className="pt-0">
            <AspectRatio ratio={g.ratio} className="border-b border-border bg-muted">
              <div className="flex size-full items-center justify-center">
                <g.icon className="size-10 text-muted-foreground" />
              </div>
            </AspectRatio>
            <CardHeader>
              <CardTitle>{g.title}</CardTitle>
              <CardDescription>{g.client}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <Tag tone={g.tone}>{g.status}</Tag>
              {g.score ? (
                <Rating readOnly value={g.score} shape="star" aria-label={`Client rating ${g.score} of 5`} />
              ) : (
                <span className="text-xs text-muted-foreground">Not rated</span>
              )}
            </CardContent>
          </Card>
        ))}
      </Masonry>
    </div>
  )
}

export default function Projects() {
  const navigate = useNavigate()
  const created = (what: string) => toast.add({ title: `${what} created`, description: "Draft saved to your workspace." })

  return (
    <Tabs defaultValue="board" className="flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex items-start gap-3">
            <PageHeaderIcon>
              <BriefcaseIcon />
            </PageHeaderIcon>
            <div className="flex flex-col gap-1">
              <PageHeaderTitle>Projects</PageHeaderTitle>
              <PageHeaderDescription>Mission pipeline, shared files and deliverables.</PageHeaderDescription>
            </div>
          </div>
          <PageHeaderActions>
            <SplitButton
              size="sm"
              onMain={() => navigate("/new-mission")}
              menuLabel="More create options"
              menu={
                <>
                  <DropdownMenuItem onClick={() => created("Mission from template")}>
                    <CopyIcon /> From template
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => created("Lead")}>
                    <LightningIcon /> Quick lead
                  </DropdownMenuItem>
                </>
              }
            >
              <PlusIcon /> New mission
            </SplitButton>
          </PageHeaderActions>
        </PageHeaderHeading>
        <PageHeaderTabs>
          <TabsList variant="line">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
        </PageHeaderTabs>
      </PageHeader>

      <TabsContent value="board">
        <BoardView />
      </TabsContent>
      <TabsContent value="files">
        <FilesView />
      </TabsContent>
      <TabsContent value="gallery">
        <GalleryView />
      </TabsContent>

      <SpeedDial label="Quick create" icon={<PlusIcon />}>
        <SpeedDialAction icon={<BriefcaseIcon />} onClick={() => created("Mission")}>
          New mission
        </SpeedDialAction>
        <SpeedDialAction icon={<UserPlusIcon />} onClick={() => created("Consultant")}>
          Add consultant
        </SpeedDialAction>
        <SpeedDialAction icon={<ReceiptIcon />} onClick={() => created("Invoice")}>
          New invoice
        </SpeedDialAction>
        <SpeedDialAction icon={<CalendarPlusIcon />} onClick={() => created("Kick-off")}>
          Schedule kick-off
        </SpeedDialAction>
      </SpeedDial>
    </Tabs>
  )
}
