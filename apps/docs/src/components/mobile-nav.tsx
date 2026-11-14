"use client"

import { Button } from "@dreambase/stardust/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dreambase/stardust/sheet"
import { MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { DocsSidebar } from "@/components/docs-sidebar"
import { MainNav } from "@/components/main-nav"
import type { NavSection } from "@/lib/nav"

function MobileNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState("macos")

  useEffect(() => setOpen(false), [pathname])

  return (
    <Sheet
      side="start"
      open={open}
      onOpenChange={(next) => {
        if (next) setPlatform(document.documentElement.dataset.platform ?? "macos")
        setOpen(next)
      }}
    >
      <SheetTrigger
        render={<Button variant="plain" tone="neutral" shape="circle" />}
        aria-label="Show navigation"
        className="docs-menu-button lg:hidden"
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>
      {/* The platform goes on a wrapper: Stardust's @scope rules don't match an element that is its own boundary. */}
      <div data-platform={platform} className="contents">
        <SheetContent className="docs-nav-sheet">
          <SheetHeader className="docs-nav-sheet-header">
            <SheetTitle>Stardust</SheetTitle>
            <SheetClose>Done</SheetClose>
          </SheetHeader>
          <SheetBody data-docs-scroller="" className="docs-nav-sheet-body">
            <MainNav orientation="vertical" onNavigate={() => setOpen(false)} />
            <DocsSidebar sections={sections} onNavigate={() => setOpen(false)} />
          </SheetBody>
        </SheetContent>
      </div>
    </Sheet>
  )
}

export { MobileNav }
