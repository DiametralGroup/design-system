import {
  ArrowClockwiseIcon,
  BellRingingIcon,
  BuildingsIcon,
  CheckIcon,
  CopyIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  ProhibitIcon,
  TrashIcon,
  UploadSimpleIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DataTable,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  MultiSelect,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderTabs,
  PageHeaderTitle,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  paginationRange,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  type ColumnDef,
} from "@diametral/design-system/react"
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react"
import { useHref } from "react-router"

// ---------- mock data ----------

const COMPANIES = [
  "Ateliers Perrin", "Groupe Lemaire", "Studio Vance", "Maison Baril", "Régie Ouest",
  "Nordlys Énergie", "Caldera Santé", "Helio Logistique", "Banque Aubrac", "Verdane Retail",
  "Sillon Mobilité", "Opaline Assurances", "Quartz Industries", "Brume Studio", "Cobalt Télécom",
  "Lumen Pharma", "Talweg Transports", "Pylône Immobilier", "Sextant Aéro", "Orée Agro",
  "Marelle Éducation", "Fjord Capital", "Argile Construction", "Nacre Cosmétiques", "Galet Hospitality",
]
const SECTORS = ["Energy", "Banking", "Retail", "Health", "Industry", "Public sector", "Transport", "Insurance", "Telecom"]
const CITIES = ["Paris", "Lyon", "Nantes", "Bordeaux", "Lille", "Toulouse", "Marseille", "Rennes"]
const FIRST = ["Camille", "Hugo", "Léa", "Nadia", "Théo", "Inès", "Julien", "Sarah", "Malik", "Chloé", "Antoine"]
const LAST = ["Perrot", "Garnier", "Moreau", "Lefèvre", "Roy", "Benali", "Faure", "Marchand", "Colin"]
const MANAGERS = [
  { name: "Camille Roux", initials: "CR" },
  { name: "Augustin Morval", initials: "AM" },
  { name: "Nadia Benali", initials: "NB" },
  { name: "Théo Garnier", initials: "TG" },
  { name: "Inès Faure", initials: "IF" },
]
const MISSIONS = ["Data platform audit", "Design system rollout", "Cloud migration", "Pricing engine", "CRM overhaul", "Mobile app v2", "Security review"]

type Status = "Active" | "Prospect" | "Paused" | "Churned"
const STATUSES: Status[] = ["Active", "Prospect", "Paused", "Churned"]
const STATUS_TONE = { Active: "success", Prospect: "info", Paused: "warning", Churned: "neutral" } as const

type Client = {
  id: string
  name: string
  sector: string
  status: Status
  manager: (typeof MANAGERS)[number]
  contact: string
  email: string
  city: string
  missions: number
  dayRate: number
  revenue: number
  since: number
}

const slug = (s: string) => s.normalize("NFD").replace(/[^\w]/g, "").toLowerCase()
const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
const eur = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

const CLIENTS: Client[] = COMPANIES.map((name, i) => {
  const status = STATUSES[[0, 0, 1, 0, 2, 0, 1, 0, 3][i % 9]]
  const first = FIRST[(i * 7) % FIRST.length]
  const last = LAST[(i * 5) % LAST.length]
  return {
    id: `c-${String(i + 1).padStart(2, "0")}`,
    name,
    sector: SECTORS[(i * 4) % SECTORS.length],
    status,
    manager: MANAGERS[i % MANAGERS.length],
    contact: `${first} ${last}`,
    email: `${slug(first)}.${slug(last)}@${slug(name)}.fr`,
    city: CITIES[(i * 3) % CITIES.length],
    missions: status === "Active" ? 1 + ((i * 3) % 5) : status === "Paused" ? 1 : 0,
    dayRate: 650 + ((i * 37) % 9) * 50,
    revenue: status === "Prospect" ? 0 : 18_000 + ((i * 7919) % 41) * 6_500,
    since: 2017 + ((i * 3) % 9),
  }
})

type InvoiceStatus = "Paid" | "Sent" | "Overdue" | "Draft"
const INVOICE_TONE = { Paid: "success", Sent: "info", Overdue: "danger", Draft: "neutral" } as const
type Invoice = { ref: string; client: string; mission: string; issued: string; amount: number; status: InvoiceStatus }

const BILLED = CLIENTS.filter((c) => c.revenue > 0)
const INVOICES: Invoice[] = Array.from({ length: 27 }, (_, i) => {
  const client = BILLED[(i * 5) % BILLED.length]
  return {
    ref: `DIA-2026-${String(214 - i).padStart(4, "0")}`,
    client: client.name,
    mission: MISSIONS[i % MISSIONS.length],
    issued: `${String(28 - (i % 27)).padStart(2, "0")}/${i < 12 ? "09" : "08"}/2026`,
    amount: client.dayRate * (6 + ((i * 7) % 15)),
    status: (["Sent", "Paid", "Paid", "Overdue", "Paid", "Draft", "Paid"] as const)[i % 7],
  }
})

// ---------- page ----------

export default function ClientsPage() {
  const [rows, setRows] = useState(CLIENTS)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [sectors, setSectors] = useState<string[]>([])
  const [status, setStatus] = useState<Status | "All">("All")
  const [selected, setSelected] = useState<string[]>([])
  const [detailId, setDetailId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Client[] | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [loading])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target as HTMLElement).closest("input, textarea, [contenteditable]")) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (c) =>
        (status === "All" || c.status === status) &&
        (!sectors.length || sectors.includes(c.sector)) &&
        (!q || `${c.name} ${c.contact} ${c.city}`.toLowerCase().includes(q))
    )
  }, [rows, query, sectors, status])

  const detail = rows.find((c) => c.id === detailId) ?? null

  // Only stable state setters inside, so the column list never changes identity.
  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Client",
        cell: ({ row }) => <ClientCell client={row.original} onOpen={() => setDetailId(row.original.id)} />,
      },
      {
        accessorKey: "sector",
        header: "Sector",
        cell: ({ row }) => <Badge variant="outline">{row.original.sector}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Tag tone={STATUS_TONE[row.original.status]}>{row.original.status}</Tag>,
      },
      {
        id: "manager",
        accessorFn: (c) => c.manager.name,
        header: "Manager",
        cell: ({ row }) => (
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Avatar size="sm">
              <AvatarFallback>{row.original.manager.initials}</AvatarFallback>
            </Avatar>
            {row.original.manager.name}
          </span>
        ),
      },
      { accessorKey: "city", header: "City", meta: { hidden: true } },
      {
        accessorKey: "missions",
        header: "Missions",
        cell: ({ row }) => <span className="tabular-nums">{row.original.missions}</span>,
      },
      {
        accessorKey: "dayRate",
        header: "Day rate",
        cell: ({ row }) => <span className="whitespace-nowrap tabular-nums">{eur(row.original.dayRate)}</span>,
      },
      {
        accessorKey: "revenue",
        header: "Revenue YTD",
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums">
            {row.original.revenue ? eur(row.original.revenue) : <span className="text-muted-foreground">—</span>}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableHiding: false,
        cell: ({ row }) => (
          <RowActions
            client={row.original}
            onOpen={() => setDetailId(row.original.id)}
            onStatus={(s) => setRows((all) => all.map((c) => (c.id === row.original.id ? { ...c, status: s } : c)))}
            onDelete={() => setPendingDelete([row.original])}
          />
        ),
      },
    ],
    []
  )

  const confirmDelete = () => {
    const removed = pendingDelete ?? []
    const ids = new Set(removed.map((c) => c.id))
    setRows((all) => all.filter((c) => !ids.has(c.id)))
    setSelected((keys) => keys.filter((k) => !ids.has(k)))
    if (detailId && ids.has(detailId)) setDetailId(null)
    setPendingDelete(null)
    toast.add({
      type: "success",
      title: removed.length === 1 ? `${removed[0].name} deleted` : `${removed.length} clients deleted`,
      description: "Their open missions were archived.",
      actionProps: {
        children: "Undo",
        onClick: () => setRows((all) => [...all, ...removed].sort((a, b) => a.id.localeCompare(b.id))),
      },
    })
  }

  const clearFilters = () => {
    setQuery("")
    setSectors([])
    setStatus("All")
  }

  return (
    <Tabs defaultValue="clients" className="flex w-full flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex items-start gap-3">
            <PageHeaderIcon>
              <UsersIcon />
            </PageHeaderIcon>
            <div className="flex flex-col gap-1">
              <PageHeaderTitle>Clients</PageHeaderTitle>
              <PageHeaderDescription>
                {rows.length} accounts · {rows.filter((c) => c.status === "Active").length} with missions running this quarter.
              </PageHeaderDescription>
            </div>
          </div>
          <PageHeaderActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <IconButton label="Refresh clients" variant="outline" size="icon-sm" onClick={() => setLoading(true)} />
                }
              >
                <ArrowClockwiseIcon />
              </TooltipTrigger>
              <TooltipContent>Refresh from CRM</TooltipContent>
            </Tooltip>
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.add({ type: "info", title: "Import queued", description: "Drop a CSV in the shared drive to sync." })}
              >
                <UploadSimpleIcon data-icon="inline-start" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.add({ type: "success", title: "Export ready", description: `${filtered.length} clients exported to clients.csv` })
                }
              >
                <DownloadSimpleIcon data-icon="inline-start" />
                Export
              </Button>
            </ButtonGroup>
          </PageHeaderActions>
        </PageHeaderHeading>
        <PageHeaderTabs>
          <TabsList variant="line">
            <TabsTrigger value="clients">Accounts</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
        </PageHeaderTabs>
      </PageHeader>

      <TabsContent value="clients" className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <InputGroup className="lg:max-w-72">
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients, contacts, cities"
              aria-label="Search clients"
            />
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <MultiSelect
            className="lg:max-w-80"
            options={SECTORS.map((s) => ({ value: s, label: s }))}
            value={sectors}
            onValueChange={setSectors}
            placeholder="All sectors"
            aria-label="Filter by sector"
          />
          <ButtonGroup aria-label="Filter by status" className="max-w-full overflow-x-auto lg:ms-auto">
            {(["All", ...STATUSES] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={status === s ? "default" : "outline"}
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
              >
                {s}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading clients">
            <Skeleton className="h-8 w-48" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 border-t border-border pt-3">
                <Skeleton className="size-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="hidden h-4 w-24 sm:block" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={8}
            rowKey={(c) => c.id}
            rowLabel={(c) => `Select ${c.name}`}
            selectable
            selectedKeys={selected}
            onSelectionChange={setSelected}
            defaultSort={[{ id: "revenue", desc: true }]}
            columnToggle
            emptyMessage={
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FunnelSimpleIcon />
                  </EmptyMedia>
                  <EmptyTitle>No client matches</EmptyTitle>
                  <EmptyDescription>
                    {rows.length ? "Try another search term or loosen the sector and status filters." : "Every client was deleted."}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {rows.length ? (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setRows(CLIENTS)}>
                      Restore demo data
                    </Button>
                  )}
                </EmptyContent>
              </Empty>
            }
            title={`${filtered.length} clients`}
            toolbar={
              selected.length ? (
                <ButtonGroup>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.add({ type: "success", title: `Reminder sent for ${selected.length} account${selected.length > 1 ? "s" : ""}` })
                    }
                  >
                    <BellRingingIcon data-icon="inline-start" />
                    Remind
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPendingDelete(rows.filter((c) => selected.includes(c.id)))}>
                    <TrashIcon data-icon="inline-start" />
                    Delete {selected.length}
                  </Button>
                </ButtonGroup>
              ) : null
            }
          />
        )}
      </TabsContent>

      <TabsContent value="invoices" className="min-w-0">
        <InvoicesTable />
      </TabsContent>

      <ClientSheet client={detail} onClose={() => setDetailId(null)} onDelete={(c) => setPendingDelete([c])} />

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDelete?.length === 1 ? `Delete ${pendingDelete[0].name}?` : `Delete ${pendingDelete?.length ?? 0} clients?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Their contacts are removed and open missions are archived. Issued invoices stay in the ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}

function ClientCell({ client, onOpen }: { client: Client; onOpen: () => void }) {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            type="button"
            onClick={onOpen}
            className="flex items-center gap-2.5 text-start font-medium whitespace-nowrap underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback>{initials(client.name)}</AvatarFallback>
        </Avatar>
        {client.name}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wider uppercase">{client.name}</p>
          <Tag tone={STATUS_TONE[client.status]}>{client.status}</Tag>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {client.sector} · {client.city} · client since {client.since}
        </p>
        <p className="mt-3 text-sm">
          {client.contact}
          <span className="block text-xs text-muted-foreground">{client.email}</span>
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

function RowActions({
  client,
  onOpen,
  onStatus,
  onDelete,
}: {
  client: Client
  onOpen: () => void
  onStatus: (s: Status) => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<IconButton label={`Actions for ${client.name}`} variant="ghost" size="icon-sm" />}>
        <DotsThreeIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{client.name}</DropdownMenuLabel>
          <DropdownMenuItem onClick={onOpen}>
            <BuildingsIcon /> Open details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard?.writeText(client.email)
              toast.add({ title: "Email copied", description: client.email })
            }}
          >
            <CopyIcon /> Copy contact email
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={client.status} onValueChange={(v) => onStatus(v as Status)}>
                {STATUSES.map((s) => (
                  <DropdownMenuRadioItem key={s} value={s}>
                    {s}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <TrashIcon /> Delete client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ClientSheet({ client, onClose, onDelete }: { client: Client | null; onClose: () => void; onDelete: (c: Client) => void }) {
  // Keep rendering the last client while the sheet animates out.
  const [last, setLast] = useState(client)
  if (client && client !== last) setLast(client)
  const c = client ?? last

  const missions = c
    ? Array.from({ length: Math.max(c.missions, 1) }, (_, i) => ({
        name: MISSIONS[(Number(c.id.slice(2)) + i) % MISSIONS.length],
        team: 1 + ((i + c.since) % 4),
        days: 20 + ((i * 17 + c.dayRate) % 60),
      }))
    : []

  return (
    <Sheet open={client !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        {c && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3 pe-10">
                <Avatar size="lg">
                  <AvatarFallback>{initials(c.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <SheetTitle>{c.name}</SheetTitle>
                  <SheetDescription>
                    {c.sector} · {c.city}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 pb-6">
              <DescriptionList>
                <DescriptionTerm>Status</DescriptionTerm>
                <DescriptionDetail>
                  <Tag tone={STATUS_TONE[c.status]}>{c.status}</Tag>
                </DescriptionDetail>
                <DescriptionTerm>Contact</DescriptionTerm>
                <DescriptionDetail className="flex items-center gap-2">
                  <span className="min-w-0">
                    {c.contact}
                    <span className="block truncate text-xs text-muted-foreground">{c.email}</span>
                  </span>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <IconButton
                          label={`Email ${c.contact}`}
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast.add({ type: "success", title: "Draft opened", description: `To: ${c.email}` })}
                        />
                      }
                    >
                      <EnvelopeSimpleIcon />
                    </TooltipTrigger>
                    <TooltipContent>Write an email</TooltipContent>
                  </Tooltip>
                </DescriptionDetail>
                <DescriptionTerm>Client since</DescriptionTerm>
                <DescriptionDetail>{c.since}</DescriptionDetail>
                <DescriptionTerm>Day rate</DescriptionTerm>
                <DescriptionDetail className="tabular-nums">{eur(c.dayRate)}</DescriptionDetail>
                <DescriptionTerm>Revenue YTD</DescriptionTerm>
                <DescriptionDetail className="tabular-nums">{eur(c.revenue)}</DescriptionDetail>
                <DescriptionTerm>Team</DescriptionTerm>
                <DescriptionDetail>
                  <AvatarGroup>
                    {MANAGERS.slice(0, 2 + (c.missions % 3)).map((m) => (
                      <Avatar key={m.initials} size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </DescriptionDetail>
              </DescriptionList>

              <section className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {c.missions ? "Missions" : "Proposed missions"}
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mission</TableHead>
                      <TableHead className="text-end">Team</TableHead>
                      <TableHead className="text-end">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missions.map((m) => (
                      <TableRow key={m.name}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell className="text-end tabular-nums">{m.team}</TableCell>
                        <TableCell className="text-end tabular-nums">{m.days}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            </div>
            <SheetFooter>
              <Button variant="destructive" onClick={() => onDelete(c)}>
                <TrashIcon data-icon="inline-start" />
                Delete client
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

const INVOICE_PAGE = 8

function InvoicesTable() {
  const [invoices, setInvoices] = useState(INVOICES)
  const [page, setPage] = useState(1)
  const href = useHref("/clients")
  const pageCount = Math.max(1, Math.ceil(invoices.length / INVOICE_PAGE))
  const current = Math.min(page, pageCount)
  const visible = invoices.slice((current - 1) * INVOICE_PAGE, current * INVOICE_PAGE)
  const outstanding = invoices.filter((i) => i.status === "Sent" || i.status === "Overdue").reduce((s, i) => s + i.amount, 0)

  const markPaid = (ref: string) => setInvoices((all) => all.map((i) => (i.ref === ref ? { ...i, status: "Paid" } : i)))
  const go = (p: number) => (e: MouseEvent) => {
    e.preventDefault()
    setPage(Math.min(pageCount, Math.max(1, p)))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Right-click an invoice for quick actions.</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Mission</TableHead>
            <TableHead className="hidden sm:table-cell">Issued</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-end">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((inv) => (
            <ContextMenu key={inv.ref}>
              <ContextMenuTrigger render={<TableRow />}>
                <TableCell className="font-mono text-xs">{inv.ref}</TableCell>
                <TableCell className="whitespace-nowrap">{inv.client}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{inv.mission}</TableCell>
                <TableCell className="hidden tabular-nums sm:table-cell">{inv.issued}</TableCell>
                <TableCell>
                  <Tag tone={INVOICE_TONE[inv.status]}>{inv.status}</Tag>
                </TableCell>
                <TableCell className="text-end whitespace-nowrap tabular-nums">{eur(inv.amount)}</TableCell>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuGroup>
                  <ContextMenuLabel>{inv.ref}</ContextMenuLabel>
                  <ContextMenuItem onClick={() => toast.add({ title: "Downloading", description: `${inv.ref}.pdf` })}>
                    <DownloadSimpleIcon /> Download PDF
                  </ContextMenuItem>
                  <ContextMenuItem
                    disabled={inv.status === "Paid" || inv.status === "Draft"}
                    onClick={() => toast.add({ type: "success", title: "Reminder sent", description: `${inv.client} · ${eur(inv.amount)}` })}
                  >
                    <BellRingingIcon /> Send reminder
                  </ContextMenuItem>
                  <ContextMenuItem disabled={inv.status === "Paid"} onClick={() => markPaid(inv.ref)}>
                    <CheckIcon /> Mark as paid
                  </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => {
                    setInvoices((all) => all.filter((i) => i.ref !== inv.ref))
                    toast.add({ type: "warning", title: `${inv.ref} voided` })
                  }}
                >
                  <ProhibitIcon /> Void invoice
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Outstanding</TableCell>
            <TableCell className="hidden md:table-cell" />
            <TableCell className="hidden sm:table-cell" />
            <TableCell />
            <TableCell className="text-end whitespace-nowrap tabular-nums">{eur(outstanding)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="text-xs tracking-wide text-muted-foreground tabular-nums">
          {invoices.length} invoices · page {current} of {pageCount}
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={href} onClick={go(current - 1)} aria-disabled={current === 1} />
            </PaginationItem>
            {paginationRange({ page: current, pageCount }).map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`e${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink href={href} isActive={p === current} onClick={go(p)}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext href={href} onClick={go(current + 1)} aria-disabled={current === pageCount} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
