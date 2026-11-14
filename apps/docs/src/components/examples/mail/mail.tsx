"use client"

import { Button } from "@dreambase/stardust/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandPalette,
  CommandPaletteContent,
} from "@dreambase/stardust/command-palette"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@dreambase/stardust/context-menu"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dreambase/stardust/dialog"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "@dreambase/stardust/list"
import { Listbox, ListboxItem } from "@dreambase/stardust/listbox"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "@dreambase/stardust/menu"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarTrailing,
  NavigationStack,
} from "@dreambase/stardust/navigation-bar"
import { SearchField } from "@dreambase/stardust/search-field"
import { Sidebar, SidebarItem, SidebarSection } from "@dreambase/stardust/sidebar"
import { SplitView, SplitViewDivider, SplitViewPane } from "@dreambase/stardust/split-view"
import { toast } from "@dreambase/stardust/toast"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSearchField,
  ToolbarSpacer,
  ToolbarTitle,
  ToolbarToggle,
} from "@dreambase/stardust/toolbar"
import { Window, WindowBody, WindowSidebar, WindowTitlebar, WindowTrafficLights } from "@dreambase/stardust/window"
import {
  ArchiveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FlagIcon,
  FolderInputIcon,
  ListFilterIcon,
  MailIcon,
  OctagonXIcon,
  ReplyAllIcon,
  ReplyIcon,
  ForwardIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"
import { ScreenSheet } from "../screen-sheet"
import { ExampleShell, MacFrame, Pad, Phone, useStage } from "../shell"
import { favorites, folders, inMailbox, mailboxes, matches, type MailboxId, type Message } from "./data"
import { ComposeFields, composeTitle, MessageMenuItems, MessageSummary, Reader } from "./parts"
import { useMailStore, type MailStore } from "./store"
import "./mail.css"

function useMailView(store: MailStore, initial: MailboxId = "inbox") {
  const [mailbox, setMailbox] = React.useState<MailboxId>(initial)
  const [query, setQuery] = React.useState("")
  const [unreadOnly, setUnreadOnly] = React.useState(false)
  const [selected, setSelected] = React.useState<string | null>("m1")
  const list = inMailbox(store.messages, mailbox)
    .filter((m) => matches(m, query))
    .filter((m) => !unreadOnly || m.unread)
  const message = store.messages.find((m) => m.id === selected && list.some((l) => l.id === m.id))
  const select = (id: string | null) => {
    setSelected(id)
    const target = store.messages.find((m) => m.id === id)
    if (target?.unread) window.setTimeout(() => store.update(target.id, { unread: false }), 900)
  }
  const openMailbox = (id: MailboxId) => {
    setMailbox(id)
    setSelected(inMailbox(store.messages, id)[0]?.id ?? null)
  }
  return { mailbox, openMailbox, query, setQuery, unreadOnly, setUnreadOnly, list, message, select }
}

type View = ReturnType<typeof useMailView>

function mailboxName(id: MailboxId) {
  return mailboxes.find((m) => m.id === id)?.name ?? "Inbox"
}

/* ── Compose ───────────────────────────────────────────────────── */

function send(to: string) {
  toast.success("Message sent", { description: to ? `To ${to}` : undefined })
}

function ComposeDialog({ store }: { store: MailStore }) {
  const { compose, setCompose } = store
  const [to, setTo] = React.useState("")
  React.useEffect(() => {
    if (compose?.message && compose.mode !== "forward" && compose.mode !== "new") setTo(compose.message.from)
    else setTo("")
  }, [compose])
  return (
    <Dialog open={compose !== null} onOpenChange={(open) => !open && setCompose(null)}>
      {compose ? (
        <DialogContent size="lg" className="ex-compose-dialog">
          <DialogHeader>
            <DialogTitle>{composeTitle(compose)}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ComposeFields key={`${compose.mode}-${compose.message?.id}`} compose={compose} onToChange={setTo} />
          </DialogBody>
          <DialogFooter>
            <DialogClose variant="cancel">Cancel</DialogClose>
            <DialogClose variant="primary" onClick={() => send(to)}>
              Send
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

/* ── Message list (Mac and iPad) ───────────────────────────────── */

function MessageList({ store, view, label }: { store: MailStore; view: View; label: string }) {
  const [menuFor, setMenuFor] = React.useState<Message | undefined>(view.message)
  if (!view.list.length) {
    return (
      <div className="ex-empty">
        <strong>{view.query ? "No results" : "No messages"}</strong>
        <span>{view.query ? `Nothing matches “${view.query}”.` : `${mailboxName(view.mailbox)} is empty.`}</span>
      </div>
    )
  }
  return (
    <ContextMenu onAction={(action) => store.act(action, menuFor)}>
      <ContextMenuTrigger className="ex-mail-list-trigger">
        <Listbox
          aria-label={label}
          className="ex-mail-list"
          value={view.message?.id ?? null}
          onValueChange={(value) => value && view.select(value as string)}
        >
          {view.list.map((message) => (
            <ListboxItem
              key={message.id}
              value={message.id}
              className="ex-mail-row"
              onContextMenu={() => {
                setMenuFor(message)
                view.select(message.id)
              }}
            >
              <MessageSummary message={message} />
            </ListboxItem>
          ))}
        </Listbox>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuFor ? <MessageMenuItems message={menuFor} /> : null}</ContextMenuContent>
    </ContextMenu>
  )
}

/* ── macOS ─────────────────────────────────────────────────────── */

function MailSidebar({ store, view }: { store: MailStore; view: View }) {
  const badge = (id: MailboxId) => {
    if (id === "drafts") return store.messages.filter((m) => m.mailbox === "drafts").length || undefined
    if (id === "flagged") return store.messages.filter((m) => m.flagged && m.mailbox !== "trash").length || undefined
    return store.unreadIn(id) || undefined
  }
  return (
    <Sidebar aria-label="Mailboxes">
      <SidebarSection title="Favorites">
        {favorites.map((box) => (
          <SidebarItem
            key={box.id}
            icon={<box.icon />}
            tint={box.tint}
            badge={badge(box.id)}
            current={view.mailbox === box.id}
            onClick={() => view.openMailbox(box.id)}
          >
            {box.name}
          </SidebarItem>
        ))}
      </SidebarSection>
      <SidebarSection title="Northwind" collapsible>
        {folders.map((box) => (
          <SidebarItem
            key={box.id}
            icon={<box.icon />}
            badge={badge(box.id)}
            current={view.mailbox === box.id}
            onClick={() => view.openMailbox(box.id)}
          >
            {box.name}
          </SidebarItem>
        ))}
      </SidebarSection>
    </Sidebar>
  )
}

function MessageActions({ store, message }: { store: MailStore; message: Message | undefined }) {
  const off = !message
  return (
    <>
      <ToolbarGroup aria-label="Organize">
        <ToolbarButton aria-label="Archive" disabled={off} onClick={() => store.act("archive", message)}>
          <ArchiveIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Delete" disabled={off} onClick={() => store.act("trash", message)}>
          <Trash2Icon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Move to Junk" disabled={off} onClick={() => store.act("junk", message)}>
          <OctagonXIcon aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup aria-label="Respond">
        <ToolbarButton aria-label="Reply" disabled={off} onClick={() => store.act("reply", message)}>
          <ReplyIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Reply All" disabled={off} onClick={() => store.act("reply-all", message)}>
          <ReplyAllIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Forward" disabled={off} onClick={() => store.act("forward", message)}>
          <ForwardIcon aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarButton
        aria-label={message?.flagged ? "Unflag" : "Flag"}
        aria-pressed={message?.flagged ?? false}
        disabled={off}
        onClick={() => store.act("toggle-flag", message)}
        className="ex-flag-button"
      >
        <FlagIcon aria-hidden="true" fill={message?.flagged ? "currentColor" : "none"} />
      </ToolbarButton>
    </>
  )
}

function MailCommands({ store, view, open, setOpen }: { store: MailStore; view: View; open: boolean; setOpen: (open: boolean) => void }) {
  const { preview } = useStage()
  React.useEffect(() => {
    if (preview) return
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        // The docs header binds ⌘K to its own search; while Mail is open, Mail's palette wins.
        event.preventDefault()
        event.stopImmediatePropagation()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKey, { capture: true })
    return () => window.removeEventListener("keydown", onKey, { capture: true })
  }, [setOpen, preview])

  return (
    <CommandPalette open={open} onOpenChange={setOpen}>
      <CommandPaletteContent title="Search mail and commands">
        <Command
          onAction={(value) => {
            setOpen(false)
            if (value.startsWith("go:")) view.openMailbox(value.slice(3) as MailboxId)
            else if (value.startsWith("open:")) {
              const target = store.messages.find((m) => m.id === value.slice(5))
              if (target) {
                view.openMailbox(target.mailbox)
                view.select(target.id)
              }
            } else store.act(value, view.message)
          }}
        >
          <CommandInput aria-label="Search mail and commands" placeholder="Search mail and commands" />
          <CommandList>
            <CommandEmpty>No matches</CommandEmpty>
            <CommandGroup>
              <CommandGroupLabel>Actions</CommandGroupLabel>
              <CommandItem value="compose">
                <CommandItemIcon>
                  <SquarePenIcon />
                </CommandItemIcon>
                New Message
              </CommandItem>
              {view.message ? (
                <>
                  <CommandItem value="reply">
                    <CommandItemIcon>
                      <ReplyIcon />
                    </CommandItemIcon>
                    Reply to {view.message.from}
                  </CommandItem>
                  <CommandItem value="archive">
                    <CommandItemIcon>
                      <ArchiveIcon />
                    </CommandItemIcon>
                    Archive “{view.message.subject}”
                  </CommandItem>
                  <CommandItem value="toggle-flag">
                    <CommandItemIcon>
                      <FlagIcon />
                    </CommandItemIcon>
                    {view.message.flagged ? "Unflag" : "Flag"} message
                  </CommandItem>
                </>
              ) : null}
            </CommandGroup>
            <CommandGroup>
              <CommandGroupLabel>Go to</CommandGroupLabel>
              {favorites.map((box) => (
                <CommandItem key={box.id} value={`go:${box.id}`} keywords={["mailbox"]}>
                  <CommandItemIcon>
                    <box.icon />
                  </CommandItemIcon>
                  {box.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <CommandGroupLabel>Messages</CommandGroupLabel>
              {store.messages
                .filter((m) => m.mailbox !== "trash")
                .map((m) => (
                  <CommandItem key={m.id} value={`open:${m.id}`} keywords={[m.from]}>
                    <CommandItemIcon>
                      <MailIcon />
                    </CommandItemIcon>
                    {m.subject}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandPaletteContent>
    </CommandPalette>
  )
}

function MacMail({ store }: { store: MailStore }) {
  const view = useMailView(store)
  const [palette, setPalette] = React.useState(false)
  const total = inMailbox(store.messages, view.mailbox).length
  const unread = inMailbox(store.messages, view.mailbox).filter((m) => m.unread).length

  return (
    <MacFrame>
      <Window aria-label="Mail">
        <WindowSidebar>
          <WindowTrafficLights />
          <MailSidebar store={store} view={view} />
        </WindowSidebar>
        <WindowTitlebar>
          <Toolbar aria-label="Mail">
            <ToolbarTitle subtitle={`${total} messages${unread ? `, ${unread} unread` : ""}`}>
              {mailboxName(view.mailbox)}
            </ToolbarTitle>
            <ToolbarToggle
              aria-label="Show unread only"
              pressed={view.unreadOnly}
              onPressedChange={(pressed) => view.setUnreadOnly(pressed)}
            >
              <ListFilterIcon aria-hidden="true" />
            </ToolbarToggle>
            <ToolbarButton aria-label="New Message" onClick={() => store.act("compose", undefined)}>
              <SquarePenIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarSpacer />
            <MessageActions store={store} message={view.message} />
            <ToolbarSearchField
              aria-label="Search mail"
              value={view.query}
              onChange={(event) => view.setQuery(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") view.setQuery("")
              }}
            />
            <ToolbarButton aria-label="Search commands" aria-keyshortcuts="Meta+K" onClick={() => setPalette(true)} className="ex-kbd-button">
              <kbd>⌘K</kbd>
            </ToolbarButton>
          </Toolbar>
        </WindowTitlebar>
        <WindowBody className="ex-mail-body">
          <SplitView>
            <SplitViewPane defaultSize={38} minSize={28} maxSize={55}>
              <div className="ex-scroll ex-fill">
                <MessageList store={store} view={view} label={mailboxName(view.mailbox)} />
              </div>
            </SplitViewPane>
            <SplitViewDivider aria-label="Resize message list" />
            <SplitViewPane minSize={30}>
              <div className="ex-scroll ex-fill">
                <Reader message={view.message} />
              </div>
            </SplitViewPane>
          </SplitView>
        </WindowBody>
      </Window>
      <ComposeDialog store={store} />
      <MailCommands store={store} view={view} open={palette} setOpen={setPalette} />
    </MacFrame>
  )
}

/* ── iPad ──────────────────────────────────────────────────────── */

function PadMail({ store }: { store: MailStore }) {
  const view = useMailView(store)
  return (
    <Pad label="Mail on iPad">
      <div className="ex-app-root ex-pad-mail">
        <div className="ex-pad-mail-sidebar">
          <NavigationBar title="Mailboxes" />
          <MailSidebar store={store} view={view} />
        </div>
        <NavigationStack className="ex-pad-mail-list">
          <NavigationBar title={mailboxName(view.mailbox)}>
            <NavigationBarTrailing>
              <Button variant="plain" shape="circle" aria-label="New Message" onClick={() => store.act("compose", undefined)}>
                <SquarePenIcon aria-hidden="true" />
              </Button>
            </NavigationBarTrailing>
          </NavigationBar>
          <div className="ex-ios-search ex-plain-search">
            <SearchField aria-label="Search mail" value={view.query} onChange={(e) => view.setQuery(e.currentTarget.value)} />
          </div>
          <MessageList store={store} view={view} label={mailboxName(view.mailbox)} />
        </NavigationStack>
        <NavigationStack className="ex-pad-mail-reader">
          <NavigationBar>
            <NavigationBarTrailing>
              <MessageButtons store={store} message={view.message} />
            </NavigationBarTrailing>
          </NavigationBar>
          <Reader message={view.message} />
        </NavigationStack>
      </div>
      <ComposeDialog store={store} />
    </Pad>
  )
}

function MessageButtons({ store, message }: { store: MailStore; message: Message | undefined }) {
  return (
    <>
      <Button variant="plain" shape="circle" aria-label="Archive" disabled={!message} onClick={() => store.act("archive", message)}>
        <ArchiveIcon aria-hidden="true" />
      </Button>
      <Button variant="plain" shape="circle" aria-label="Delete" disabled={!message} onClick={() => store.act("trash", message)}>
        <Trash2Icon aria-hidden="true" />
      </Button>
      {message ? (
        <Menu onAction={(action) => store.act(action, message)}>
          <MenuTrigger variant="plain" shape="circle" indicator={false} aria-label="Reply, forward and more">
            <ReplyIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuContent>
            <MessageMenuItems message={message} />
          </MenuContent>
        </Menu>
      ) : null}
    </>
  )
}

/* ── iPhone ────────────────────────────────────────────────────── */

type PhoneScreen = { name: "mailboxes" } | { name: "list"; mailbox: MailboxId } | { name: "message"; mailbox: MailboxId; id: string }

function PhoneMail({ store }: { store: MailStore }) {
  const [screen, setScreen] = React.useState<PhoneScreen>({ name: "list", mailbox: "inbox" })
  const [direction, setDirection] = React.useState<"push" | "pop" | null>(null)
  const [query, setQuery] = React.useState("")
  const [to, setTo] = React.useState("")
  const go = (next: PhoneScreen, dir: "push" | "pop") => {
    setDirection(dir)
    setScreen(next)
  }
  const motion = direction === "push" ? "ex-push" : direction === "pop" ? "ex-pop" : ""

  let content: React.ReactNode
  if (screen.name === "mailboxes") {
    content = (
      <NavigationStack key="mailboxes" className={`ex-grouped-stack ${motion}`}>
        <NavigationBar title="Mailboxes" largeTitle>
          <NavigationBarTrailing>
            <Button variant="plain" size="sm">
              Edit
            </Button>
          </NavigationBarTrailing>
        </NavigationBar>
        <List>
          <ListSection>
            {favorites.map((box) => (
              <ListRow key={box.id} onClick={() => go({ name: "list", mailbox: box.id }, "push")}>
                <span className="ex-mailbox-glyph" aria-hidden="true">
                  <box.icon />
                </span>
                <ListRowTitle>{box.name}</ListRowTitle>
                {store.unreadIn(box.id) ? <ListRowValue>{store.unreadIn(box.id)}</ListRowValue> : null}
                <ListRowAccessory type="disclosure" />
              </ListRow>
            ))}
          </ListSection>
          <ListSection header="Northwind">
            {folders.map((box) => (
              <ListRow key={box.id} onClick={() => go({ name: "list", mailbox: box.id }, "push")}>
                <span className="ex-mailbox-glyph" aria-hidden="true">
                  <box.icon />
                </span>
                <ListRowTitle>{box.name}</ListRowTitle>
                <ListRowAccessory type="disclosure" />
              </ListRow>
            ))}
          </ListSection>
        </List>
      </NavigationStack>
    )
  } else if (screen.name === "list") {
    const list = inMailbox(store.messages, screen.mailbox).filter((m) => matches(m, query))
    const unread = list.filter((m) => m.unread).length
    content = (
      <div key={`list-${screen.mailbox}`} className={`ex-phone-screen ${motion}`}>
        <NavigationStack>
          <NavigationBar title={mailboxName(screen.mailbox)} largeTitle>
            <NavigationBarBackButton onClick={() => go({ name: "mailboxes" }, "pop")}>Mailboxes</NavigationBarBackButton>
            <NavigationBarTrailing>
              <Button variant="plain" size="sm">
                Select
              </Button>
            </NavigationBarTrailing>
          </NavigationBar>
          <div className="ex-ios-search ex-plain-search">
            <SearchField aria-label="Search mail" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
          </div>
          {list.length ? (
            <ul className="ex-phone-mail-list" aria-label={mailboxName(screen.mailbox)}>
              {list.map((message) => (
                <li key={message.id} className="ex-phone-mail-item">
                  <button
                    type="button"
                    className="ex-phone-mail-row"
                    onClick={() => {
                      go({ name: "message", mailbox: screen.mailbox, id: message.id }, "push")
                      if (message.unread) store.update(message.id, { unread: false })
                    }}
                  >
                    <MessageSummary message={message} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ex-empty">
              <strong>No messages</strong>
            </div>
          )}
        </NavigationStack>
        <Toolbar variant="floating" aria-label="Mailbox" className="ex-phone-toolbar">
          <ToolbarButton aria-label="Filter unread">
            <ListFilterIcon aria-hidden="true" />
          </ToolbarButton>
          <span className="ex-phone-toolbar-status" role="status">
            <strong>Updated just now</strong>
            <span>{unread} unread</span>
          </span>
          <ToolbarButton aria-label="New Message" onClick={() => store.act("compose", undefined)}>
            <SquarePenIcon aria-hidden="true" />
          </ToolbarButton>
        </Toolbar>
      </div>
    )
  } else {
    const list = inMailbox(store.messages, screen.mailbox)
    const index = list.findIndex((m) => m.id === screen.id)
    const message = store.messages.find((m) => m.id === screen.id)
    const move = (step: number) => {
      const next = list[index + step]
      if (!next) return
      setScreen({ ...screen, id: next.id })
      if (next.unread) store.update(next.id, { unread: false })
    }
    content = (
      <div key="message" className={`ex-phone-screen ${motion}`}>
        <NavigationStack>
          <NavigationBar>
            <NavigationBarBackButton onClick={() => go({ name: "list", mailbox: screen.mailbox }, "pop")}>
              {mailboxName(screen.mailbox)}
            </NavigationBarBackButton>
            <NavigationBarTrailing>
              <Button variant="plain" shape="circle" aria-label="Previous message" disabled={index <= 0} onClick={() => move(-1)}>
                <ChevronUpIcon aria-hidden="true" />
              </Button>
              <Button
                variant="plain"
                shape="circle"
                aria-label="Next message"
                disabled={index < 0 || index >= list.length - 1}
                onClick={() => move(1)}
              >
                <ChevronDownIcon aria-hidden="true" />
              </Button>
            </NavigationBarTrailing>
          </NavigationBar>
          <Reader message={message} compact />
        </NavigationStack>
        {message ? (
          <Toolbar variant="floating" aria-label="Message" className="ex-phone-toolbar">
            <ToolbarButton
              aria-label="Delete"
              onClick={() => {
                store.act("trash", message)
                go({ name: "list", mailbox: screen.mailbox }, "pop")
              }}
            >
              <Trash2Icon aria-hidden="true" />
            </ToolbarButton>
            <Menu
              onAction={(action) => {
                store.act(action, message)
                go({ name: "list", mailbox: screen.mailbox }, "pop")
              }}
            >
              <MenuTrigger variant="glass" tone="neutral" shape="circle" indicator={false} aria-label="Move to">
                <FolderInputIcon aria-hidden="true" />
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="archive">
                  <MenuItemIcon>
                    <ArchiveIcon />
                  </MenuItemIcon>
                  Archive
                </MenuItem>
                <MenuItem value="junk">
                  <MenuItemIcon>
                    <OctagonXIcon />
                  </MenuItemIcon>
                  Junk
                </MenuItem>
              </MenuContent>
            </Menu>
            <Menu onAction={(action) => store.act(action, message)}>
              <MenuTrigger variant="glass" tone="neutral" shape="circle" indicator={false} aria-label="Reply, forward and more">
                <ReplyIcon aria-hidden="true" />
              </MenuTrigger>
              <MenuContent>
                <MessageMenuItems message={message} />
              </MenuContent>
            </Menu>
            <ToolbarButton aria-label="New Message" onClick={() => store.act("compose", undefined)}>
              <SquarePenIcon aria-hidden="true" />
            </ToolbarButton>
          </Toolbar>
        ) : null}
      </div>
    )
  }

  const compose = store.compose
  return (
    <Phone label="Mail on iPhone">
      <div className="ex-app-root">
        {content}
        <ScreenSheet
          open={compose !== null}
          onOpenChange={(open) => !open && store.setCompose(null)}
          title={compose ? composeTitle(compose) : "New Message"}
          className="ex-phone-compose"
        >
          {compose ? (
            <>
              <div className="ex-sheet-bar">
                <Button variant="plain" onClick={() => store.setCompose(null)}>
                  Cancel
                </Button>
                <span className="ex-sheet-bar-title" aria-hidden="true">
                  {composeTitle(compose)}
                </span>
                <Button
                  variant="filled"
                  shape="circle"
                  size="sm"
                  aria-label="Send"
                  onClick={() => {
                    send(to || (compose.message?.from ?? ""))
                    store.setCompose(null)
                  }}
                >
                  <SendGlyph />
                </Button>
              </div>
              <ComposeFields key={`${compose.mode}-${compose.message?.id}`} compose={compose} onToChange={setTo} />
            </>
          ) : null}
        </ScreenSheet>
      </div>
    </Phone>
  )
}

function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

/* ── Root ──────────────────────────────────────────────────────── */

function MailApp() {
  const store = useMailStore()
  const { platform } = useStage()
  if (platform === "ios") return <PhoneMail store={store} />
  if (platform === "ipados") return <PadMail store={store} />
  return <MacMail store={store} />
}

function MailExample() {
  return (
    <ExampleShell title="Mail" platforms={["macos", "ipados", "ios"]}>
      <MailApp />
    </ExampleShell>
  )
}

export { MailApp, MailExample }
