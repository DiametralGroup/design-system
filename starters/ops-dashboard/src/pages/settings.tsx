import {
  ArrowCounterClockwiseIcon,
  GearIcon,
  KeyIcon,
  PersonSimpleRunIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
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
  AlertDialogTrigger,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ColorPicker,
  DirectionProvider,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Kbd,
  KbdGroup,
  Label,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderTabs,
  PageHeaderTitle,
  Panel,
  PanelContent,
  PanelHeader,
  PanelRow,
  PanelTitle,
  QrCode,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Snippet,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  toast,
} from "@diametral/design-system/react"
import { type ComponentProps, useState } from "react"
import { Link } from "react-router"

type Tone = NonNullable<ComponentProps<typeof Button>["tone"]>
const TONES: Tone[] = ["black", "red", "brown", "khaki", "beige", "green", "blue", "yellow"]

const TIMEZONES = { paris: "Europe/Paris (UTC+2)", london: "Europe/London (UTC+1)", montreal: "America/Montreal (UTC−4)" }
const LANGUAGES = { en: "English", fr: "Français" }
const DIGEST_DAYS = { mon: "Monday", fri: "Friday" }

const TOTP_SECRET = "JBSWY3DPEHPK3PXP"
const EXPECTED_CODE = "482913"

const API_KEYS = [
  { id: "k1", name: "Pennylane sync", key: "dmtl_live_8f2c41e09b7a4d3f9a", created: "12 Mar 2026" },
  { id: "k2", name: "Planning export", key: "dmtl_live_1d77a0c3e5b24f18c2", created: "2 Aug 2026" },
]

const NOTIFICATIONS = [
  { id: "staffed", title: "Mission staffed", description: "When you are added to a mission team.", on: true },
  { id: "overdue", title: "Invoice overdue", description: "When a client invoice passes its due date.", on: true },
  { id: "timesheet", title: "Timesheet reminder", description: "Friday at 16:00 if your week is incomplete.", on: false },
  { id: "sow", title: "SoW signed", description: "When a client signs a statement of work.", on: true },
]

const SHORTCUTS = [
  {
    group: "Navigation",
    items: [
      { keys: ["⌘", "K"], label: "Open the command palette" },
      { keys: ["G", "O"], label: "Go to Overview" },
      { keys: ["G", "P"], label: "Go to Planning" },
    ],
  },
  {
    group: "Missions",
    items: [
      { keys: ["N"], label: "New mission" },
      { keys: ["⌘", "↵"], label: "Submit the current step" },
      { keys: ["⌘", "⇧", "D"], label: "Duplicate a mission" },
    ],
  },
]

const HELP_LINKS = [
  { title: "Guides", description: "Staffing, invoicing and day-rate grids." },
  { title: "API reference", description: "Endpoints for missions, invoices and timesheets." },
  { title: "Status", description: "Uptime of Diametral Ops services." },
]

function ProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How colleagues and clients see you on missions.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>CR</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">Camille Roux</span>
            <span className="text-sm text-muted-foreground">Senior manager · Paris office</span>
          </div>
          <Button variant="outline" size="sm" className="sm:ms-auto">
            Change photo
          </Button>
        </div>
        <Separator />
        <FieldGroup className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="st-name">Full name</FieldLabel>
            <Input id="st-name" defaultValue="Camille Roux" />
          </Field>
          <Field>
            <FieldLabel htmlFor="st-email">Work email</FieldLabel>
            <InputGroup>
              <InputGroupInput id="st-email" defaultValue="camille" />
              <InputGroupAddon align="inline-end">@diametral.com</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel id="st-tz-label">Time zone</FieldLabel>
            <Select items={TIMEZONES} defaultValue="paris">
              <SelectTrigger className="w-full" aria-labelledby="st-tz-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIMEZONES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel id="st-lang-label">Language</FieldLabel>
            <Select items={LANGUAGES} defaultValue="en">
              <SelectTrigger className="w-full" aria-labelledby="st-lang-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="st-bio">Consultant bio</FieldLabel>
            <Textarea
              id="st-bio"
              rows={3}
              defaultValue="Ten years leading data and finance transformation missions for energy and banking clients."
            />
            <FieldDescription>Shown on staffing proposals sent to clients.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={() => toast.add({ type: "success", title: "Profile saved" })}>Save profile</Button>
      </CardFooter>
    </Card>
  )
}

function SecurityTab() {
  const [code, setCode] = useState("")
  const [rejected, setRejected] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [keys, setKeys] = useState(API_KEYS)
  const [confirmText, setConfirmText] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Scan the code with your authenticator app, then enter the 6-digit code.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <QrCode value={`otpauth://totp/Diametral%20Ops:camille?secret=${TOTP_SECRET}&issuer=Diametral%20Ops`} size={144} />
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-sm text-muted-foreground">Can't scan? Enter this key by hand:</span>
              <Snippet value={TOTP_SECRET} />
            </div>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (code !== EXPECTED_CODE) return setRejected(true)
              setTwoFactor(true)
              setCode("")
              toast.add({ type: "success", title: "Two-factor enabled", description: "You'll be asked for a code at sign-in." })
            }}
          >
            <Field data-invalid={rejected || undefined}>
              <FieldLabel htmlFor="st-otp">Verification code</FieldLabel>
              <InputOTP
                id="st-otp"
                maxLength={6}
                value={code}
                onChange={(next) => {
                  setCode(next)
                  setRejected(false)
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-invalid={rejected}
              >
                <InputOTPGroup>
                  {[0, 1, 2].map((i) => (
                    <InputOTPSlot key={i} index={i} aria-invalid={rejected} />
                  ))}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  {[3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} aria-invalid={rejected} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {rejected ? (
                <FieldError>That code doesn't match. Try again.</FieldError>
              ) : (
                <FieldDescription>Demo code: {EXPECTED_CODE}.</FieldDescription>
              )}
            </Field>
            <Button type="submit" size="sm" className="self-start" disabled={code.length < 6 || twoFactor}>
              <ShieldCheckIcon /> Verify and enable
            </Button>
          </form>
        </CardContent>
        <CardFooter className="border-t">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="st-2fa">Require two-factor at sign-in</FieldLabel>
              <FieldDescription>{twoFactor ? "Enabled on this account." : "Verify a code above to enable."}</FieldDescription>
            </FieldContent>
            <Switch id="st-2fa" checked={twoFactor} onCheckedChange={setTwoFactor} disabled={!twoFactor} />
          </Field>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-6">
        <Panel>
          <PanelHeader className="border-b">
            <PanelTitle className="flex items-center gap-2">
              <KeyIcon /> API keys
            </PanelTitle>
            <Button
              size="xs"
              tone="green"
              onClick={() => {
                const id = crypto.randomUUID().replaceAll("-", "")
                setKeys([...keys, { id, name: "New key", key: `dmtl_live_${id.slice(0, 20)}`, created: "Today" }])
                toast.add({ title: "API key created", description: "Copy it now — it won't be shown in full again." })
              }}
            >
              <PlusIcon /> New key
            </Button>
          </PanelHeader>
          {keys.length === 0 && <PanelContent className="text-muted-foreground">No active keys.</PanelContent>}
          <div>
            {keys.map((k) => (
              <PanelRow key={k.id} className="flex-wrap">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="font-medium">
                    {k.name} <span className="font-normal text-muted-foreground">· created {k.created}</span>
                  </span>
                  <Snippet value={k.key}>{`${k.key.slice(0, 10)}••••••${k.key.slice(-4)}`}</Snippet>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>Revoke</AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke “{k.name}”?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Integrations using this key stop working immediately. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          setKeys(keys.filter((row) => row.id !== k.id))
                          toast.add({ type: "warning", title: "Key revoked", description: k.name })
                        }}
                      >
                        Revoke key
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </PanelRow>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Danger zone</PanelTitle>
          </PanelHeader>
          <PanelContent className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-sm text-muted-foreground">
              Delete your account and hand your 6 active missions back to their engagement leads.
            </p>
            <AlertDialog
              open={deleteOpen}
              onOpenChange={(open) => {
                setDeleteOpen(open)
                setConfirmText("")
              }}
            >
              <AlertDialogTrigger render={<Button tone="red" />}>
                <TrashIcon /> Delete account
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your timesheets are kept for invoicing, but you lose access to Diametral Ops. Type DELETE to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                  <Label htmlFor="st-delete-confirm" className="sr-only">
                    Type DELETE to confirm
                  </Label>
                  <Input
                    id="st-delete-confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    autoComplete="off"
                  />
                </Field>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my account</AlertDialogCancel>
                  <AlertDialogAction
                    tone="red"
                    disabled={confirmText !== "DELETE"}
                    onClick={() => {
                      setDeleteOpen(false)
                      toast.add({ type: "error", title: "Account scheduled for deletion", description: "You have 14 days to cancel." })
                    }}
                  >
                    Delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </PanelContent>
        </Panel>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.on])))
  const [frequency, setFrequency] = useState("weekly")
  const [quiet, setQuiet] = useState([20, 8])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel>
        <PanelHeader className="border-b">
          <PanelTitle className="flex items-center gap-2">
            <Icon name="bell" /> Email alerts
          </PanelTitle>
        </PanelHeader>
        <div>
          {NOTIFICATIONS.map((n) => (
            <PanelRow key={n.id}>
              <div className="flex flex-col">
                <Label htmlFor={`st-notif-${n.id}`}>{n.title}</Label>
                <span className="text-xs text-muted-foreground">{n.description}</span>
              </div>
              <Switch
                id={`st-notif-${n.id}`}
                checked={enabled[n.id]}
                onCheckedChange={(checked) => setEnabled({ ...enabled, [n.id]: checked })}
              />
            </PanelRow>
          ))}
        </div>
      </Panel>

      <Card>
        <CardHeader>
          <CardTitle>Digest</CardTitle>
          <CardDescription>A summary of staffing, invoices and timesheets.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel id="st-freq-label">Frequency</FieldLabel>
              <ToggleGroup
                variant="outline"
                spacing={0}
                value={[frequency]}
                onValueChange={(value) => value[0] && setFrequency(value[0] as string)}
                aria-labelledby="st-freq-label"
              >
                <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                <ToggleGroupItem value="never">Never</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel id="st-day-label">Send on</FieldLabel>
              <Select items={DIGEST_DAYS} defaultValue="mon" disabled={frequency !== "weekly"}>
                <SelectTrigger className="w-full sm:w-48" aria-labelledby="st-day-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DIGEST_DAYS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Separator />
            <Field>
              <FieldLabel id="st-quiet-label">
                Quiet hours — {quiet[0]}:00 to {quiet[1]}:00
              </FieldLabel>
              <Slider
                value={quiet}
                min={0}
                max={24}
                onValueChange={(value) => setQuiet(value as number[])}
                aria-labelledby="st-quiet-label"
              />
              <FieldDescription>No push notifications between these hours. Urgent invoices still go through.</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

function AppearanceTab() {
  const [accent, setAccent] = useState("#161616")
  const [tone, setTone] = useState<Tone>("black")
  const [scale, setScale] = useState(100)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")
  const rtl = dir === "rtl"

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Personal preferences for this browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel id="st-accent-label">Chart accent</FieldLabel>
              <ColorPicker value={accent} onChange={setAccent} aria-label="Chart accent" />
              <FieldDescription>Used for the highlighted series in Analytics. Current: {accent}.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel id="st-density-label">Density</FieldLabel>
              <ToggleGroup variant="outline" spacing={0} defaultValue={["comfortable"]} aria-labelledby="st-density-label">
                <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
                <ToggleGroupItem value="spacious">Spacious</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel id="st-scale-label">Text size — {scale}%</FieldLabel>
              <Slider
                value={scale}
                min={85}
                max={130}
                step={5}
                onValueChange={(value) => setScale(value as number)}
                aria-labelledby="st-scale-label"
              />
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Reduce motion</FieldTitle>
                <FieldDescription>Disable chart and panel animations.</FieldDescription>
              </FieldContent>
              <Toggle variant="outline" pressed={reduceMotion} onPressedChange={setReduceMotion} aria-label="Reduce motion">
                <PersonSimpleRunIcon /> {reduceMotion ? "On" : "Off"}
              </Toggle>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary action tone</CardTitle>
            <CardDescription>The colour of call-to-action buttons. Neutral by default.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div role="group" aria-label="Button tone" className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <Button
                  key={t}
                  size="xs"
                  tone={t}
                  variant={t === tone ? "default" : "outline"}
                  aria-pressed={t === tone}
                  onClick={() => setTone(t)}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <Button tone={tone}>Default</Button>
              <Button tone={tone} variant="outline">
                Outline
              </Button>
              <Button tone={tone} variant="secondary">
                Secondary
              </Button>
              <Button tone={tone} variant="ghost">
                Ghost
              </Button>
              <Button tone={tone} variant="link">
                Link
              </Button>
              <Button tone={tone} variant="destructive">
                Destructive
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Right-to-left preview</CardTitle>
            <CardDescription>Check how mission cards mirror for Arabic-speaking clients.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ToggleGroup
              variant="outline"
              spacing={0}
              value={[dir]}
              onValueChange={(value) => value[0] && setDir(value[0] as "ltr" | "rtl")}
              aria-label="Text direction"
            >
              <ToggleGroupItem value="ltr">LTR</ToggleGroupItem>
              <ToggleGroupItem value="rtl">RTL</ToggleGroupItem>
            </ToggleGroup>
            <DirectionProvider direction={dir}>
              <div dir={dir} lang={rtl ? "ar" : "en"} className="flex flex-col gap-3 border border-border p-4">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>LS</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{rtl ? "لومن للطاقة" : "Lumen SA"}</span>
                    <span className="text-xs text-muted-foreground">{rtl ? "تدقيق منصة البيانات" : "Data platform audit"}</span>
                  </div>
                  <Button size="xs" variant="outline" className="ms-auto">
                    {rtl ? "فتح" : "Open"}
                  </Button>
                </div>
                <Field orientation="horizontal">
                  <Switch id="st-rtl-remote" size="sm" defaultChecked />
                  <FieldLabel htmlFor="st-rtl-remote">{rtl ? "العمل عن بعد" : "Remote-friendly"}</FieldLabel>
                </Field>
              </div>
            </DirectionProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ShortcutsTab() {
  return (
    <Panel className="max-w-2xl">
      <PanelHeader className="border-b">
        <PanelTitle>Keyboard shortcuts</PanelTitle>
        <Field orientation="horizontal" className="w-auto">
          <Switch id="st-single-key" size="sm" defaultChecked />
          <FieldLabel htmlFor="st-single-key" className="whitespace-nowrap">
            Single-key shortcuts
          </FieldLabel>
        </Field>
      </PanelHeader>
      <PanelContent className="flex flex-col gap-4">
        {SHORTCUTS.map((section, index) => (
          <div key={section.group} className="flex flex-col gap-2">
            {index > 0 && <Separator className="mb-2" />}
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{section.group}</h3>
            <dl className="flex flex-col">
              {section.items.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-4 py-1.5">
                  <dt>{s.label}</dt>
                  <dd>
                    <KbdGroup>
                      {s.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </PanelContent>
    </Panel>
  )
}

export default function Settings() {
  const [compact, setCompact] = useState(false)
  const [lang, setLang] = useState("en")

  return (
    <Tabs defaultValue="profile" className="flex flex-col gap-6">
      <Menubar className="w-fit max-w-full overflow-x-auto">
        <MenubarMenu>
          <MenubarTrigger>Settings</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => toast.add({ title: "Settings exported", description: "diametral-ops-settings.json" })}>
              Export… <MenubarShortcut>⌘E</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Import…</MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive" onClick={() => toast.add({ type: "warning", title: "Settings reset to defaults" })}>
              <ArrowCounterClockwiseIcon /> Reset to defaults
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={compact} onCheckedChange={setCompact}>
              Compact sidebar
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Language</MenubarLabel>
            <MenubarRadioGroup value={lang} onValueChange={(value) => setLang(value as string)}>
              <MenubarRadioItem value="en">English</MenubarRadioItem>
              <MenubarRadioItem value="fr">Français</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Switch workspace <MenubarShortcut>⌘⇧W</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Sign out everywhere</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <PageHeader>
        <PageHeaderHeading>
          <div className="flex items-start gap-3">
            <PageHeaderIcon>
              <GearIcon />
            </PageHeaderIcon>
            <div className="flex flex-col gap-1">
              <PageHeaderTitle>Settings</PageHeaderTitle>
              <PageHeaderDescription>Your profile, security and workspace preferences.</PageHeaderDescription>
            </div>
          </div>
          <PageHeaderActions>
            <NavigationMenu align="end">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Help</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-72 gap-1">
                      {HELP_LINKS.map((link) => (
                        <li key={link.title}>
                          <NavigationMenuLink render={<Link to="/settings" />} className="block p-3 hover:bg-muted">
                            <span className="text-xs font-semibold tracking-wider uppercase">{link.title}</span>
                            <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink render={<Link to="/inbox" />} className={navigationMenuTriggerStyle()}>
                    Contact support
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </PageHeaderActions>
        </PageHeaderHeading>
        <PageHeaderTabs>
          <TabsList variant="line" className="max-w-full justify-start overflow-x-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>
        </PageHeaderTabs>
      </PageHeader>

      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>
      <TabsContent value="security">
        <SecurityTab />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
      <TabsContent value="appearance">
        <AppearanceTab />
      </TabsContent>
      <TabsContent value="shortcuts">
        <ShortcutsTab />
      </TabsContent>
    </Tabs>
  )
}
