"use client"

import * as React from "react"
import {
  BellIcon,
  CheckIcon,
  CopyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  CalendarIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  EyeIcon,
  FileIcon,
  FolderIcon,
  FunnelIcon,
  GearIcon,
  HouseIcon,
  ListIcon,
  ListBulletsIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  MoonIcon,
  PencilSimpleIcon,
  PlusIcon,
  SignOutIcon,
  SquaresFourIcon,
  SunIcon,
  TrashIcon,
  UploadSimpleIcon,
  UserIcon,
  UsersIcon,
  XIcon,
  type Icon as PhosphorIcon,
  type IconProps,
} from "@phosphor-icons/react"

import { cn } from "../lib/utils.js"

// A typed name → component registry over @phosphor-icons/react. Add an entry
// here (import + key) as a consuming component needs one — only the icons
// listed get bundled, unlike v1's hand-drawn SVG map which shipped every icon
// unconditionally.
const icons = {
  bell: BellIcon,
  check: CheckIcon,
  copy: CopyIcon,
  // DiametralGroup addition: the names 0.x's <Icon> and <ds-icon> accept
  // (components/icons.tsx holds the same glyphs as raw SVG for <ds-icon>).
  search: MagnifyingGlassIcon,
  menu: ListIcon,
  x: XIcon,
  "chevron-down": CaretDownIcon,
  "chevron-right": CaretRightIcon,
  "chevron-left": CaretLeftIcon,
  "chevron-up": CaretUpIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  user: UserIcon,
  users: UsersIcon,
  settings: GearIcon,
  trash: TrashIcon,
  edit: PencilSimpleIcon,
  download: DownloadSimpleIcon,
  upload: UploadSimpleIcon,
  filter: FunnelIcon,
  calendar: CalendarIcon,
  file: FileIcon,
  folder: FolderIcon,
  home: HouseIcon,
  grid: SquaresFourIcon,
  list: ListBulletsIcon,
  "external-link": ArrowSquareOutIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-left": ArrowLeftIcon,
  "more-horizontal": DotsThreeIcon,
  eye: EyeIcon,
  lock: LockIcon,
  "log-out": SignOutIcon,
  sun: SunIcon,
  moon: MoonIcon,
} satisfies Record<string, PhosphorIcon>

type IconName = keyof typeof icons

function Icon({
  name,
  className,
  ...props
}: { name: IconName } & IconProps) {
  const Component = icons[name]
  return (
    <Component data-slot="icon" className={cn("ds-icon", className)} {...props} />
  )
}

export { Icon, icons }
export type { IconName }
