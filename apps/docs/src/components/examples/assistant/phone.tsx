"use client"

import { Avatar } from "macbetter/avatar"
import { Button } from "macbetter/button"
import { Inspector } from "macbetter/inspector"
import { List, ListRow, ListRowAccessory, ListRowIcon, ListRowSubtitle, ListRowTitle, ListSection } from "macbetter/list"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarTrailing,
  NavigationStack,
} from "macbetter/navigation-bar"
import { SearchField } from "macbetter/search-field"
import { BookOpenIcon, FolderIcon, LayersIcon, PuzzleIcon, SquarePenIcon } from "lucide-react"
import * as React from "react"
import { ScreenSheet } from "../screen-sheet"
import { Phone } from "../shell"
import { ReplyComposer } from "./composer"
import { person, projects, type Skill } from "./data"
import { ChatDetails } from "./details"
import { PhoneNewChat } from "./new-chat"
import { PluginsDirectory } from "./plugins"
import { SkillDetail, SkillsList } from "./skills"
import { go, newChat, openChat, threadOf, titleOf, useAssistant } from "./store"
import { Thread } from "./thread"

/** The list of chats: where the iPhone app starts a new chat, opens a project, plugins or skills. */
function HistoryScreen({ onOpen }: { onOpen: () => void }) {
  const { recents, chatId } = useAssistant()
  const [query, setQuery] = React.useState("")
  const needle = query.trim().toLowerCase()
  const shown = needle ? recents.filter((recent) => recent.title.toLowerCase().includes(needle)) : recents

  return (
    <NavigationStack className="ex-grouped-stack ex-ai-phone-stack">
      <NavigationBar title="Chats" largeTitle>
        <NavigationBarTrailing>
          <Button
            variant="plain"
            shape="circle"
            aria-label="New Chat"
            onClick={() => {
              newChat()
              onOpen()
            }}
          >
            <SquarePenIcon aria-hidden="true" />
          </Button>
        </NavigationBarTrailing>
      </NavigationBar>
      <div className="ex-ios-search">
        <SearchField aria-label="Search chats" value={query} onValueChange={(value) => setQuery(value)} />
      </div>
      <List>
        {needle ? null : (
          <>
            <ListSection>
              <ListRow onClick={() => go("plugins")}>
                <ListRowIcon color="indigo">
                  <PuzzleIcon aria-hidden="true" />
                </ListRowIcon>
                <ListRowTitle>Plugins</ListRowTitle>
                <ListRowAccessory type="disclosure" />
              </ListRow>
              <ListRow onClick={() => go("skills")}>
                <ListRowIcon color="orange">
                  <BookOpenIcon aria-hidden="true" />
                </ListRowIcon>
                <ListRowTitle>Skills</ListRowTitle>
                <ListRowAccessory type="disclosure" />
              </ListRow>
            </ListSection>
            <ListSection header="Projects">
              {projects.map((project) => (
                <ListRow
                  key={project.id}
                  onClick={() => {
                    newChat({ project: project.id })
                    onOpen()
                  }}
                >
                  <ListRowIcon color="accent">
                    <FolderIcon aria-hidden="true" />
                  </ListRowIcon>
                  <ListRowTitle>{project.name}</ListRowTitle>
                  <ListRowAccessory type="disclosure" />
                </ListRow>
              ))}
            </ListSection>
          </>
        )}
        <ListSection header="Recents">
          {shown.map((recent) => (
            <ListRow
              key={recent.id}
              aria-current={recent.id === chatId ? "page" : undefined}
              onClick={() => {
                openChat(recent.id)
                onOpen()
              }}
            >
              <ListRowTitle>{recent.title}</ListRowTitle>
            </ListRow>
          ))}
          {shown.length === 0 ? (
            <ListRow>
              <ListRowTitle className="ex-ai-muted">No chats match “{query.trim()}”</ListRowTitle>
            </ListRow>
          ) : null}
        </ListSection>
        {needle ? null : (
          <ListSection>
            <ListRow onClick={() => {}}>
              <Avatar name={person.name} size="md" color="orange" />
              <ListRowTitle>{person.name}</ListRowTitle>
              <ListRowSubtitle>{person.plan}</ListRowSubtitle>
              <ListRowAccessory type="disclosure" />
            </ListRow>
          </ListSection>
        )}
      </List>
    </NavigationStack>
  )
}

function PhoneAssistant() {
  const state = useAssistant()
  const [history, setHistory] = React.useState(false)
  const [details, setDetails] = React.useState(false)
  const [skill, setSkill] = React.useState<Skill | null>(null)
  const showDetails = React.useCallback(() => setDetails(true), [])
  const { screen } = state
  const title = titleOf(state)
  const busy = state.status === "submitted" || state.status === "streaming"

  let content: React.ReactNode
  if (screen === "plugins" || screen === "skills") {
    content = (
      <NavigationStack key={screen} className="ex-ai-phone-stack">
        <NavigationBar title={screen === "plugins" ? "Plugins" : "Skills"} largeTitle>
          <NavigationBarBackButton
            onClick={() => {
              setHistory(true)
              go("chat")
            }}
          >
            Chats
          </NavigationBarBackButton>
        </NavigationBar>
        {screen === "plugins" ? <PluginsDirectory title={false} /> : <SkillsList title={false} onOpen={setSkill} />}
      </NavigationStack>
    )
  } else if (history) {
    content = <HistoryScreen onOpen={() => setHistory(false)} />
  } else {
    content = (
      <div className="ex-ai-phone-main">
        <NavigationBar title={screen === "chat" ? title : "New chat"} className="ex-ai-phone-bar">
          {/* The chat's title needs the room, so the back button shows only its chevron, as iOS does. */}
          <NavigationBarBackButton aria-label="Chats" onClick={() => setHistory(true)} />
          <NavigationBarTrailing>
            {screen === "chat" ? (
              <Button variant="plain" shape="circle" aria-label="Outputs and Sources" onClick={showDetails}>
                <LayersIcon aria-hidden="true" />
              </Button>
            ) : null}
            <Button variant="plain" shape="circle" aria-label="New Chat" onClick={() => newChat()}>
              <SquarePenIcon aria-hidden="true" />
            </Button>
          </NavigationBarTrailing>
        </NavigationBar>
        {screen === "chat" ? (
          <Thread key={state.chatId} turns={threadOf(state, state.chatId)} title={title} busy={busy} onShowSources={showDetails} className="ex-ai-phone-thread">
            <ReplyComposer floating compact />
          </Thread>
        ) : (
          <div className="ex-ai-phone-new">
            <PhoneNewChat />
            <ReplyComposer floating compact placeholder="Ask anything" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="ex-app-root ex-ai-phone">
      {content}
      <ScreenSheet open={details} onOpenChange={setDetails} title="Details" hideTitle={false} className="ex-ai-sheet">
        <Inspector aria-label="Details" className="ex-ai-sheet-inspector">
          <ChatDetails />
        </Inspector>
      </ScreenSheet>
      <ScreenSheet open={skill !== null} onOpenChange={(open) => !open && setSkill(null)} title={skill?.name ?? "Skill"} className="ex-ai-sheet">
        {skill ? (
          <SkillDetail
            skill={skill}
            renderTitle={(name) => (
              <p aria-hidden="true" className="ex-ai-skill-title">
                {name}
              </p>
            )}
            onClose={() => setSkill(null)}
            onTry={() => {
              setSkill(null)
              setHistory(false)
              newChat({ draft: `Use the ${skill.name} skill to ` })
            }}
          />
        ) : null}
      </ScreenSheet>
    </div>
  )
}

function PhoneApp() {
  return (
    <Phone label="Assistant on iPhone">
      <PhoneAssistant />
    </Phone>
  )
}

export { PhoneApp }
