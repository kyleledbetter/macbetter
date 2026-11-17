"use client"

import { Avatar } from "macbetter/avatar"
import { Button } from "macbetter/button"
import { Dialog, DialogContent, DialogTitle } from "macbetter/dialog"
import { Inspector, InspectorBody, InspectorClose, InspectorHeader, InspectorTitle } from "macbetter/inspector"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "macbetter/menu"
import { SearchField } from "macbetter/search-field"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import {
  Window,
  WindowBody,
  WindowSidebar,
  WindowSidebarHeader,
  WindowTitlebar,
  WindowTitlebarCenter,
  WindowTitlebarLeading,
  WindowTitlebarTrailing,
  WindowTrafficLights,
} from "macbetter/window"
import {
  ArchiveIcon,
  BookOpenIcon,
  FolderIcon,
  FolderInputIcon,
  LogOutIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PencilIcon,
  PuzzleIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"
import { MacFrame, useStage } from "../shell"
import { NewChatComposer, ReplyComposer } from "./composer"
import { person, plugins, projects, type Skill } from "./data"
import { ChatDetails } from "./details"
import { PluginGlyphIcon } from "./icons"
import { MacNewChat } from "./new-chat"
import { PluginsDirectory } from "./plugins"
import { SkillDetail, SkillsList } from "./skills"
import { go, newChat, openChat, threadOf, titleOf, useAssistant } from "./store"
import { Thread } from "./thread"

function AccountMenu() {
  return (
    <Menu>
      <MenuTrigger variant="plain" tone="neutral" className="ex-ai-account" indicator={false} aria-label={`${person.name}, ${person.plan}`}>
        <Avatar name={person.name} size="sm" color="orange" />
        <span className="ex-ai-account-text">
          <span className="ex-ai-account-name">{person.name}</span>
          <span className="ex-ai-account-plan">{person.plan}</span>
        </span>
      </MenuTrigger>
      <MenuContent side="top" align="start">
        <MenuItem value="settings">
          <MenuItemIcon>
            <SettingsIcon />
          </MenuItemIcon>
          Settings…
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="sign-out">
          <MenuItemIcon>
            <LogOutIcon />
          </MenuItemIcon>
          Sign Out
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function MacSidebar({ onCollapse }: { onCollapse: () => void }) {
  const { screen, chatId, recents, installed, project } = useAssistant()
  const [searching, setSearching] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const needle = query.trim().toLowerCase()
  const shown = needle ? recents.filter((recent) => recent.title.toLowerCase().includes(needle)) : recents

  return (
    <WindowSidebar>
      <WindowSidebarHeader>
        <WindowTrafficLights />
        <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="Hide Sidebar" onClick={onCollapse}>
          <PanelLeftIcon aria-hidden="true" />
        </Button>
      </WindowSidebarHeader>
      <div className="ex-ai-sidebar-title">
        <span className="ex-ai-app-name">Assistant</span>
        <Button
          variant="plain"
          tone="neutral"
          size="sm"
          shape="circle"
          aria-label="Search Chats"
          aria-pressed={searching}
          onClick={() => {
            setSearching(!searching)
            setQuery("")
          }}
        >
          <SearchIcon aria-hidden="true" />
        </Button>
      </div>
      {searching ? (
        <div className="ex-ai-sidebar-search">
          <SearchField size="sm" aria-label="Search chats" placeholder="Search chats" autoFocus value={query} onValueChange={(value) => setQuery(value)} />
        </div>
      ) : null}
      <Sidebar aria-label="Assistant" className="ex-ai-sidebar">
        <SidebarSection>
          <SidebarItem icon={<SquarePenIcon />} current={screen === "new" && !project} onClick={() => newChat()}>
            New chat
          </SidebarItem>
          <SidebarItem icon={<PuzzleIcon />} current={screen === "plugins"} onClick={() => go("plugins")}>
            Plugins
          </SidebarItem>
          <SidebarItem icon={<BookOpenIcon />} current={screen === "skills"} onClick={() => go("skills")}>
            Skills
          </SidebarItem>
        </SidebarSection>
        {screen === "plugins" ? (
          <SidebarSection title="Installed">
            {plugins
              .filter((plugin) => installed.includes(plugin.id))
              .map((plugin) => (
                <SidebarItem key={plugin.id} icon={<PluginGlyphIcon glyph={plugin.glyph} />} tint={`var(--mb-${plugin.color === "gray" ? "indigo" : plugin.color})`}>
                  {plugin.name}
                </SidebarItem>
              ))}
          </SidebarSection>
        ) : null}
        <SidebarSection title="Projects">
          {projects.map((entry) => (
            <SidebarItem
              key={entry.id}
              icon={<FolderIcon />}
              current={screen === "new" && project === entry.id}
              onClick={() => newChat({ project: entry.id })}
            >
              {entry.name}
            </SidebarItem>
          ))}
        </SidebarSection>
        <SidebarSection title="Recents" className="ex-ai-recents">
          {shown.map((recent) => (
            <SidebarItem key={recent.id} current={screen === "chat" && chatId === recent.id} onClick={() => openChat(recent.id)}>
              {recent.title}
            </SidebarItem>
          ))}
          {shown.length === 0 ? <li className="ex-ai-sidebar-empty">No chats match “{query.trim()}”</li> : null}
        </SidebarSection>
      </Sidebar>
      <div className="ex-ai-sidebar-footer">
        <AccountMenu />
      </div>
    </WindowSidebar>
  )
}

function TitleMenu({ title }: { title: string }) {
  return (
    <Menu>
      <MenuTrigger variant="plain" tone="neutral" className="ex-ai-title-menu">
        <span className="ex-ai-title-text">{title}</span>
      </MenuTrigger>
      <MenuContent align="start">
        <MenuItem value="rename">
          <MenuItemIcon>
            <PencilIcon />
          </MenuItemIcon>
          Rename…
        </MenuItem>
        <MenuItem value="move">
          <MenuItemIcon>
            <FolderInputIcon />
          </MenuItemIcon>
          Move to Project…
        </MenuItem>
        <MenuItem value="archive">
          <MenuItemIcon>
            <ArchiveIcon />
          </MenuItemIcon>
          Archive
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="delete">
          <MenuItemIcon>
            <Trash2Icon />
          </MenuItemIcon>
          Delete Chat
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function MacAssistant() {
  const state = useAssistant()
  const { width } = useStage()
  const [sidebar, setSidebar] = React.useState(true)
  const [inspector, setInspector] = React.useState<boolean | null>(null)
  const [mode, setMode] = React.useState("chat")
  const [skill, setSkill] = React.useState<Skill | null>(null)
  const showSources = React.useCallback(() => setInspector(true), [])

  const { screen } = state
  const title = titleOf(state)
  const busy = state.status === "submitted" || state.status === "streaming"
  // The inspector opens on its own when the window is wide enough to keep the thread readable.
  const inspectorOpen = screen === "chat" && (inspector ?? width >= 1100)

  return (
    <MacFrame>
      <Window aria-label="Assistant" className="ex-ai-window">
        {sidebar ? <MacSidebar onCollapse={() => setSidebar(false)} /> : null}
        <WindowTitlebar bordered={screen === "chat"}>
          {sidebar ? null : <WindowTrafficLights />}
          <WindowTitlebarLeading>
            {sidebar ? null : (
              <>
                <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="Show Sidebar" onClick={() => setSidebar(true)}>
                  <PanelLeftIcon aria-hidden="true" />
                </Button>
                <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="New Chat" onClick={() => newChat()}>
                  <SquarePenIcon aria-hidden="true" />
                </Button>
              </>
            )}
            {screen === "chat" ? <TitleMenu title={title} /> : null}
          </WindowTitlebarLeading>
          {screen === "new" ? (
            <WindowTitlebarCenter>
              <SegmentedControl size="sm" aria-label="Mode" value={mode} onValueChange={(value) => value && setMode(String(value))}>
                <SegmentedControlItem value="chat">Chat</SegmentedControlItem>
                <SegmentedControlItem value="work">Work</SegmentedControlItem>
              </SegmentedControl>
            </WindowTitlebarCenter>
          ) : null}
          <WindowTitlebarTrailing>
            {screen === "chat" ? (
              <>
                <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="Share Chat">
                  <ShareIcon aria-hidden="true" />
                </Button>
                <Button
                  variant="plain"
                  tone="neutral"
                  size="sm"
                  shape="circle"
                  aria-label={inspectorOpen ? "Hide Inspector" : "Show Inspector"}
                  aria-pressed={inspectorOpen}
                  onClick={() => setInspector(!inspectorOpen)}
                >
                  <PanelRightIcon aria-hidden="true" />
                </Button>
              </>
            ) : null}
          </WindowTitlebarTrailing>
        </WindowTitlebar>
        <WindowBody className="ex-ai-body" data-screen={screen}>
          {screen === "chat" ? (
            <>
              <Thread key={state.chatId} turns={threadOf(state, state.chatId)} title={title} busy={busy} onShowSources={showSources} />
              <div className="ex-ai-dock">
                <ReplyComposer />
              </div>
            </>
          ) : screen === "new" ? (
            <MacNewChat composer={<NewChatComposer />} />
          ) : screen === "plugins" ? (
            <PluginsDirectory />
          ) : (
            <SkillsList onOpen={setSkill} />
          )}
        </WindowBody>
        {inspectorOpen ? (
          <Inspector className="ex-ai-inspector">
            <InspectorHeader>
              <InspectorTitle>Details</InspectorTitle>
              <InspectorClose onClick={() => setInspector(false)} />
            </InspectorHeader>
            <InspectorBody>
              <ChatDetails />
            </InspectorBody>
          </Inspector>
        ) : null}
      </Window>
      <Dialog open={skill !== null} onOpenChange={(open) => !open && setSkill(null)}>
        <DialogContent size="lg" className="ex-ai-skill-dialog">
          {skill ? (
            <SkillDetail
              skill={skill}
              renderTitle={(name) => <DialogTitle className="ex-ai-skill-title">{name}</DialogTitle>}
              onClose={() => setSkill(null)}
              onTry={() => {
                setSkill(null)
                newChat({ draft: `Use the ${skill.name} skill to ` })
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </MacFrame>
  )
}

export { MacAssistant }
