import {
  ArchiveIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  AtIcon,
  ChatsCircleIcon,
  EnvelopeSimpleIcon,
  FileIcon,
  FilePdfIcon,
  FileXlsIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PaperclipIcon,
  PaperPlaneRightIcon,
  TrayIcon,
  XIcon,
} from "@phosphor-icons/react"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Bubble,
  BubbleContent,
  Button,
  CodeBlock,
  CodeBlockBody,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHead,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Editable,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  IconButton,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Kbd,
  KbdGroup,
  Marker,
  MarkerContent,
  MarkerIcon,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Snippet,
  Spinner,
  Tag,
  Textarea,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@diametral/design-system/react"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@diametral/design-system/react/message-scroller"
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react"

// ---------- mock data ----------

const ME = { name: "Camille Roux", initials: "CR" }

type FileKind = "pdf" | "xls" | "doc"
type Doc = { name: string; size: string; kind: FileKind }
type Msg = {
  id: string
  mine?: boolean
  day: string
  time: string
  text: string
  files?: Doc[]
  code?: { filename: string; code: string }
  snippet?: string
}
type Thread = { id: string; name: string; company: string; subject: string; unread: number; messages: Msg[] }

const FILE_ICON: Record<FileKind, ReactNode> = { pdf: <FilePdfIcon />, xls: <FileXlsIcon />, doc: <FileIcon /> }

const SQL = `SELECT site_id, date_trunc('hour', read_at) AS hour,
       avg(output_kw) AS avg_kw
FROM   turbine_readings
WHERE  read_at >= now() - interval '7 days'
GROUP  BY 1, 2
ORDER  BY 1, 2;`

const THREADS: Thread[] = [
  {
    id: "t1",
    name: "Hugo Garnier",
    company: "Nordlys Énergie",
    subject: "Data platform audit — kick-off follow-up",
    unread: 2,
    messages: [
      { id: "t1-1", day: "Monday 21 September", time: "09:12", text: "Thanks again for Friday's workshop. The team left with a lot of questions, in a good way." },
      { id: "t1-2", mine: true, day: "Monday 21 September", time: "09:40", text: "Glad it landed. I'm sending the audit plan and the interview schedule today.", files: [{ name: "audit-plan-v2.pdf", size: "1.8 MB", kind: "pdf" }] },
      { id: "t1-3", day: "Yesterday", time: "16:05", text: "Our dashboard query takes 40 s on the warehouse. Is this the kind of thing you'll look at?", code: { filename: "hourly_output.sql", code: SQL } },
      { id: "t1-4", mine: true, day: "Yesterday", time: "16:22", text: "Exactly the kind. My first guess is a missing partition on read_at — we'll confirm in week 1." },
      { id: "t1-5", day: "Today", time: "08:47", text: "Great. I've added Nadia from infra to the Thursday interview." },
      { id: "t1-6", day: "Today", time: "08:49", text: "Also attaching last quarter's cost report, the storage line is the painful one.", files: [{ name: "cloud-costs-Q3.xlsx", size: "96 KB", kind: "xls" }] },
    ],
  },
  {
    id: "t2",
    name: "Léa Moreau",
    company: "Banque Aubrac",
    subject: "Staffing for the Q4 pricing engine",
    unread: 1,
    messages: [
      { id: "t2-1", mine: true, day: "Yesterday", time: "11:00", text: "We can staff two senior engineers from 5 October, 850 € / day each." },
      { id: "t2-2", day: "Today", time: "10:15", text: "Procurement is fine with the rate. Can one of them start on 28 September for onboarding?" },
    ],
  },
  {
    id: "t3",
    name: "Malik Colin",
    company: "Cobalt Télécom",
    subject: "VPN access for the team",
    unread: 0,
    messages: [
      { id: "t3-1", day: "Yesterday", time: "14:30", text: "Accounts are created. Everyone goes through the bastion:", snippet: "ssh -J ops@bastion.cobalt.fr dev@10.2.4.18" },
      { id: "t3-2", mine: true, day: "Yesterday", time: "14:41", text: "Works for me. I'll forward it to Théo and Inès." },
    ],
  },
  {
    id: "t4",
    name: "Sarah Marchand",
    company: "Caldera Santé",
    subject: "Invoice DIA-2026-0207",
    unread: 0,
    messages: [
      { id: "t4-1", day: "Monday 21 September", time: "10:02", text: "Could you re-issue the invoice with our new PO number, 4500-8812?" },
      { id: "t4-2", mine: true, day: "Monday 21 September", time: "10:30", text: "Done, here's the corrected one.", files: [{ name: "DIA-2026-0207.pdf", size: "212 KB", kind: "pdf" }] },
      { id: "t4-3", day: "Monday 21 September", time: "10:34", text: "Perfect, forwarded to accounts payable." },
    ],
  },
  {
    id: "t5",
    name: "Julien Roy",
    company: "Helio Logistique",
    subject: "Design system rollout — weekly",
    unread: 0,
    messages: [
      { id: "t5-1", mine: true, day: "Friday 18 September", time: "17:20", text: "Weekly notes: 34 of 52 screens migrated, the data table landed in the ops console.", files: [{ name: "weekly-38.docx", size: "48 KB", kind: "doc" }] },
      { id: "t5-2", day: "Friday 18 September", time: "17:45", text: "Nice progress. Let's demo it to the warehouse leads next week." },
    ],
  },
  {
    id: "t6",
    name: "Inès Faure",
    company: "Diametral",
    subject: "Day rate grid 2027",
    unread: 0,
    messages: [
      { id: "t6-1", day: "Thursday 17 September", time: "09:00", text: "Draft grid for 2027 is in the drive. Senior +4 %, principal flat.", files: [{ name: "grille-tjm-2027.xlsx", size: "31 KB", kind: "xls" }] },
    ],
  },
  {
    id: "t7",
    name: "Chloé Lefèvre",
    company: "Lumen Pharma",
    subject: "Security review scope",
    unread: 0,
    messages: [
      { id: "t7-1", day: "Wednesday 16 September", time: "15:10", text: "We'd like the review to cover the partner API and the mobile app, not the intranet." },
      { id: "t7-2", mine: true, day: "Wednesday 16 September", time: "15:32", text: "Noted — that's 12 days instead of 18. Updated proposal by Friday." },
    ],
  },
]

const UPLOADS: Doc[] = [
  { name: "meeting-notes.docx", size: "22 KB", kind: "doc" },
  { name: "proposal-v3.pdf", size: "1.1 MB", kind: "pdf" },
  { name: "planning-oct.xlsx", size: "64 KB", kind: "xls" },
]

const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

const desktopQuery = "(min-width: 768px)"
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(desktopQuery)
      mq.addEventListener("change", cb)
      return () => mq.removeEventListener("change", cb)
    },
    () => matchMedia(desktopQuery).matches
  )
}

// ---------- page ----------

export default function InboxPage() {
  const [threads, setThreads] = useState(THREADS)
  const [activeId, setActiveId] = useState<string | null>(null)
  // Index of the first unread message in the open thread, captured on open.
  const [newFrom, setNewFrom] = useState<number | null>(null)
  const [query, setQuery] = useState("")
  const isDesktop = useIsDesktop()

  const open = (id: string) => {
    const t = threads.find((x) => x.id === id)
    if (!t) return
    setActiveId(id)
    setNewFrom(t.unread ? t.messages.length - t.unread : null)
    if (t.unread) setThreads((all) => all.map((x) => (x.id === id ? { ...x, unread: 0 } : x)))
  }

  // On desktop, open the first thread so the conversation pane is never blank.
  useEffect(() => {
    if (isDesktop && activeId === null) open(THREADS[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  const update = (id: string, fn: (t: Thread) => Thread) => setThreads((all) => all.map((t) => (t.id === id ? fn(t) : t)))

  const archive = (id: string) => {
    const index = threads.findIndex((t) => t.id === id)
    const removed = threads[index]
    setThreads((all) => all.filter((t) => t.id !== id))
    if (activeId === id) setActiveId(null)
    toast.add({
      title: "Conversation archived",
      description: removed.subject,
      actionProps: {
        children: "Undo",
        onClick: () => setThreads((all) => [...all.slice(0, index), removed, ...all.slice(index)]),
      },
    })
  }

  const q = query.trim().toLowerCase()
  const visible = threads.filter((t) => !q || `${t.name} ${t.company} ${t.subject}`.toLowerCase().includes(q))
  const active = threads.find((t) => t.id === activeId) ?? null
  const unreadTotal = threads.reduce((s, t) => s + t.unread, 0)

  const list = (
    <ThreadList
      threads={visible}
      activeId={activeId}
      query={query}
      onQuery={setQuery}
      onOpen={open}
      onArchive={archive}
      onToggleRead={(id) => update(id, (t) => ({ ...t, unread: t.unread ? 0 : 1 }))}
    />
  )
  const conversation = active ? (
    <Conversation
      key={active.id}
      thread={active}
      newFrom={newFrom}
      onBack={isDesktop ? undefined : () => setActiveId(null)}
      onRename={(subject) => update(active.id, (t) => ({ ...t, subject }))}
      onArchive={() => archive(active.id)}
      onMarkUnread={() => {
        update(active.id, (t) => ({ ...t, unread: 1 }))
        setActiveId(null)
      }}
      onAppend={(msg) => update(active.id, (t) => ({ ...t, messages: [...t.messages, msg] }))}
    />
  ) : (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrayIcon />
        </EmptyMedia>
        <EmptyTitle>No conversation open</EmptyTitle>
        <EmptyDescription>Pick a thread on the left to read it.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader>
        <PageHeaderHeading>
          <div className="flex flex-col gap-1">
            <PageHeaderTitle>Inbox</PageHeaderTitle>
            <PageHeaderDescription>
              {unreadTotal ? `${unreadTotal} unread message${unreadTotal > 1 ? "s" : ""}` : "You're all caught up"} across {threads.length} client conversations.
            </PageHeaderDescription>
          </div>
        </PageHeaderHeading>
      </PageHeader>

      <div className="h-[calc(100svh-15rem)] min-h-[30rem] border border-border">
        {isDesktop ? (
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="34%" minSize="24%" maxSize="50%">
              {list}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize="40%">{conversation}</ResizablePanel>
          </ResizablePanelGroup>
        ) : active ? (
          conversation
        ) : (
          list
        )}
      </div>
    </div>
  )
}

function ThreadList({
  threads,
  activeId,
  query,
  onQuery,
  onOpen,
  onArchive,
  onToggleRead,
}: {
  threads: Thread[]
  activeId: string | null
  query: string
  onQuery: (q: string) => void
  onOpen: (id: string) => void
  onArchive: (id: string) => void
  onToggleRead: (id: string) => void
}) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="border-b border-border p-3">
        <InputGroup>
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search conversations" aria-label="Search conversations" />
        </InputGroup>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {threads.length ? (
          <ItemGroup className="gap-0 p-1.5" aria-label="Conversations">
            {threads.map((t) => {
              const last = t.messages[t.messages.length - 1]
              return (
                <ContextMenu key={t.id}>
                  <ContextMenuTrigger render={<div />}>
                    <Item
                      size="sm"
                      variant={t.id === activeId ? "muted" : "default"}
                      aria-current={t.id === activeId ? "true" : undefined}
                      className="flex-nowrap text-start hover:bg-muted/60"
                      render={<button type="button" onClick={() => onOpen(t.id)} />}
                    >
                      <ItemMedia>
                        <Avatar>
                          <AvatarFallback>{initials(t.name)}</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent className="min-w-0">
                        <ItemTitle className={t.unread ? "" : "font-medium"}>{t.name}</ItemTitle>
                        <ItemDescription className="line-clamp-1">
                          <span className={t.unread ? "text-foreground" : ""}>{t.subject}</span>
                          {" — "}
                          {last.mine ? "You: " : ""}
                          {last.text}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-col items-end gap-1.5 self-start">
                        <span className="text-xs text-muted-foreground tabular-nums">{last.time}</span>
                        {t.unread ? <Badge>{t.unread}</Badge> : null}
                      </ItemActions>
                    </Item>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => onToggleRead(t.id)}>
                      <EnvelopeSimpleIcon /> {t.unread ? "Mark as read" : "Mark as unread"}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => onArchive(t.id)}>
                      <ArchiveIcon /> Archive
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )
            })}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChatsCircleIcon />
              </EmptyMedia>
              <EmptyTitle>No conversations</EmptyTitle>
              <EmptyDescription>{query ? `Nothing matches “${query}”.` : "Everything is archived."}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ScrollArea>
    </div>
  )
}

type Draft = Doc & { id: number; state: "uploading" | "done" }

function Conversation({
  thread,
  newFrom,
  onBack,
  onRename,
  onArchive,
  onMarkUnread,
  onAppend,
}: {
  thread: Thread
  newFrom: number | null
  onBack?: () => void
  onRename: (subject: string) => void
  onArchive: () => void
  onMarkUnread: () => void
  onAppend: (msg: Msg) => void
}) {
  const [text, setText] = useState("")
  const [files, setFiles] = useState<Draft[]>([])
  const [sending, setSending] = useState(false)
  const nextId = useRef(0)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  const firstName = thread.name.split(" ")[0]
  const canSend = !sending && (text.trim() !== "" || files.some((f) => f.state === "done")) && !files.some((f) => f.state === "uploading")

  const addFile = () => {
    const id = nextId.current++
    setFiles((all) => [...all, { ...UPLOADS[id % UPLOADS.length], id, state: "uploading" }])
    later(() => setFiles((all) => all.map((f) => (f.id === id ? { ...f, state: "done" } : f))), 1200)
  }

  const send = () => {
    if (!canSend) return
    setSending(true)
    const msg: Msg = {
      id: `${thread.id}-${Date.now()}`,
      mine: true,
      day: "Today",
      time: now(),
      text: text.trim(),
      files: files.length ? files.map(({ name, size, kind }) => ({ name, size, kind })) : undefined,
    }
    later(() => {
      onAppend(msg)
      setText("")
      setFiles([])
      setSending(false)
      later(
        () =>
          onAppend({
            id: `${thread.id}-${Date.now()}-r`,
            day: "Today",
            time: now(),
            text: `Thanks ${ME.name.split(" ")[0]}, noted. I'll come back to you before end of day.`,
          }),
        2500
      )
    }, 700)
  }

  const messages = thread.messages
  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="flex items-center gap-3 border-b border-border px-3 py-2.5 md:px-4">
        {onBack && (
          <IconButton label="Back to conversations" variant="ghost" size="icon-sm" onClick={onBack}>
            <ArrowLeftIcon />
          </IconButton>
        )}
        <Avatar>
          <AvatarFallback>{initials(thread.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Editable aria-label="Subject" value={thread.subject} onSubmit={(v) => v.trim() && onRename(v.trim())} className="min-w-0 text-sm font-medium [&_[data-slot=editable-preview]]:truncate" />
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            {thread.name}
            <Tag tone={thread.company === "Diametral" ? "neutral" : "info"} className="px-2 py-0.5">
              {thread.company}
            </Tag>
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger render={<IconButton label="Mark as unread" variant="ghost" size="icon-sm" onClick={onMarkUnread} />}>
            <EnvelopeSimpleIcon />
          </TooltipTrigger>
          <TooltipContent>Mark as unread</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<IconButton label="Archive conversation" variant="ghost" size="icon-sm" onClick={onArchive} />}>
            <ArchiveIcon />
          </TooltipTrigger>
          <TooltipContent>Archive</TooltipContent>
        </Tooltip>
      </header>

      <div className="min-h-0 flex-1">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent className="gap-4">
                {messages.map((m, i) => (
                  <MessageScrollerItem key={m.id} messageId={m.id} scrollAnchor={i === messages.length - 1} className="flex flex-col gap-4">
                    {m.day !== messages[i - 1]?.day && (
                      <Marker variant="separator">
                        <MarkerContent>{m.day}</MarkerContent>
                      </Marker>
                    )}
                    {i === newFrom && (
                      <Marker variant="border">
                        <MarkerIcon>
                          <ArrowDownIcon />
                        </MarkerIcon>
                        <MarkerContent>
                          {messages.length - i} new message{messages.length - i > 1 ? "s" : ""}
                        </MarkerContent>
                      </Marker>
                    )}
                    <ChatMessage msg={m} name={thread.name} />
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-3">
        {files.length > 0 && (
          <AttachmentGroup>
            {files.map((f) => (
              <Attachment key={f.id} size="sm" state={f.state}>
                <AttachmentMedia>{f.state === "uploading" ? <Spinner label={`Uploading ${f.name}`} /> : FILE_ICON[f.kind]}</AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{f.name}</AttachmentTitle>
                  <AttachmentDescription>{f.state === "uploading" ? "Uploading…" : f.size}</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction aria-label={`Remove ${f.name}`} onClick={() => setFiles((all) => all.filter((x) => x.id !== f.id))}>
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>
        )}
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              send()
            }
          }}
          rows={2}
          placeholder={`Reply to ${firstName}…`}
          aria-label={`Reply to ${thread.name}`}
          disabled={sending}
        />
        <div className="flex items-center justify-between gap-2">
          <Toolbar aria-label="Composer actions" className="border-0 p-0">
            <ToolbarGroup>
              <ToolbarButton aria-label="Attach a file" onClick={addFile}>
                <PaperclipIcon />
              </ToolbarButton>
              <ToolbarButton aria-label={`Mention ${firstName}`} onClick={() => setText((t) => `${t}${t && !t.endsWith(" ") ? " " : ""}@${firstName} `)}>
                <AtIcon />
              </ToolbarButton>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarButton
              aria-label="Insert quick reply"
              onClick={() => setText("Thanks, I'll check with the team and get back to you by tomorrow.")}
            >
              <LightningIcon />
            </ToolbarButton>
          </Toolbar>
          <div className="flex items-center gap-3">
            <KbdGroup className="hidden sm:inline-flex" aria-hidden>
              <Kbd>⌘</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            <Button size="sm" onClick={send} disabled={!canSend}>
              {sending ? <Spinner label="Sending" data-icon="inline-start" /> : <PaperPlaneRightIcon data-icon="inline-start" />}
              {sending ? "Sending" : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ msg, name }: { msg: Msg; name: string }) {
  return (
    <Message align={msg.mine ? "end" : "start"}>
      <MessageAvatar>
        <Avatar size="sm">
          <AvatarFallback>{msg.mine ? ME.initials : initials(name)}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent className="min-w-0">
        {!msg.mine && <MessageHeader>{name}</MessageHeader>}
        {msg.text && (
          <Bubble variant={msg.mine ? "default" : "muted"}>
            <BubbleContent>{msg.text}</BubbleContent>
          </Bubble>
        )}
        {msg.snippet && <Snippet value={msg.snippet} />}
        {msg.code && (
          <CodeBlock className="w-full max-w-lg">
            <CodeBlockHead>
              <CodeBlockFilename>{msg.code.filename}</CodeBlockFilename>
              <CodeBlockCopyButton value={msg.code.code} />
            </CodeBlockHead>
            <CodeBlockBody code={msg.code.code} />
          </CodeBlock>
        )}
        {msg.files && (
          <AttachmentGroup>
            {msg.files.map((f) => (
              <Attachment key={f.name} size="sm">
                <AttachmentMedia>{FILE_ICON[f.kind]}</AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{f.name}</AttachmentTitle>
                  <AttachmentDescription>{f.size}</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            ))}
          </AttachmentGroup>
        )}
        <MessageFooter>
          {msg.time}
          {msg.mine ? " · Delivered" : ""}
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}
