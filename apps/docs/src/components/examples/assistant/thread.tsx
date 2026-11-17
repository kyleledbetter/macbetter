"use client"

import { ArtifactCard, ArtifactCardAction, ArtifactCardActions, ArtifactCardIcon, ArtifactCardMeta, ArtifactCardTitle } from "macbetter/artifact-card"
import { Artwork } from "macbetter/artwork"
import { Attachment, AttachmentName, AttachmentPreview } from "macbetter/attachment"
import { Button } from "macbetter/button"
import { Chat, ChatContent, ChatScrollButton, ChatViewport } from "macbetter/chat"
import {
  Confirmation,
  ConfirmationActions,
  ConfirmationDescription,
  ConfirmationDetails,
  ConfirmationIcon,
  ConfirmationTitle,
} from "macbetter/confirmation"
import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"
import {
  GeneratedImage,
  GeneratedImageActions,
  GeneratedImageStage,
  GeneratedImageThumbnail,
  GeneratedImageThumbnails,
} from "macbetter/generated-image"
import { MenuItem, MenuItemIcon, MenuSeparator } from "macbetter/menu"
import {
  Message,
  MessageAction,
  MessageActionCopy,
  MessageActionMenu,
  MessageActions,
  MessageActionToggle,
  MessageAttachments,
  MessageBubble,
  MessageContent,
  MessageMeta,
} from "macbetter/message"
import { formatDuration, Reasoning, ReasoningContent, ReasoningTrigger } from "macbetter/reasoning"
import { Response } from "macbetter/response"
import { Citation, Source, Sources, SourcesContent, SourcesTrigger } from "macbetter/sources"
import {
  ToolActivity,
  ToolActivityContent,
  ToolActivitySummary,
  ToolCall,
  ToolCallDetail,
  ToolCallIcon,
  ToolCallSection,
  ToolCallTitle,
} from "macbetter/tool-call"
import {
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FlagIcon,
  GitBranchIcon,
  PencilIcon,
  RotateCcwIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Volume2Icon,
  WrenchIcon,
} from "lucide-react"
import * as React from "react"
import { Markdown } from "@/components/ai/markdown"
import { ToolGlyph } from "./icons"
import type { AssistantTurn, Pair, ReplyPart, Turn, UserTurn } from "./script"
import { answer, send } from "./store"

/** What the thread asks its screen to do: open the inspector, or an output. */
type ThreadActions = { onShowSources: () => void }

const ThreadContext = React.createContext<ThreadActions>({ onShowSources: () => {} })

function Pairs({ pairs, layout }: { pairs: Pair[]; layout: "rows" | "stacked" }) {
  return (
    <DescriptionList layout={layout} size="sm">
      {pairs.map(([label, value]) => (
        <DescriptionItem key={label}>
          <DescriptionTerm>{label}</DescriptionTerm>
          <DescriptionDetails mono={label === "Tool"}>{value}</DescriptionDetails>
        </DescriptionItem>
      ))}
    </DescriptionList>
  )
}

function UserMessage({ turn, latest }: { turn: UserTurn; latest: boolean }) {
  return (
    <Message from="user" latest={latest}>
      {turn.attachment ? (
        <MessageAttachments>
          <Attachment variant="thumbnail">
            <AttachmentPreview>
              <Artwork seed={turn.attachment.seed} palette="forest" variant="strata" />
            </AttachmentPreview>
            <AttachmentName>{turn.attachment.name}</AttachmentName>
          </Attachment>
        </MessageAttachments>
      ) : null}
      <MessageContent>
        <MessageBubble>{turn.text}</MessageBubble>
      </MessageContent>
    </Message>
  )
}

function plainText(turn: AssistantTurn) {
  return turn.parts
    .map((part) =>
      part.kind === "markdown" ? part.text : part.parts.map((piece) => (typeof piece === "string" ? piece : `[${piece.label}]`)).join("")
    )
    .join("\n\n")
}

function ReplyParts({ parts, streaming }: { parts: ReplyPart[]; streaming: boolean }) {
  const { onShowSources } = React.useContext(ThreadContext)
  return parts.map((part, index) =>
    part.kind === "markdown" ? (
      // Parts are positional: a reply only ever grows at its end.
      <Markdown key={index} streaming={streaming && index === parts.length - 1}>
        {part.text}
      </Markdown>
    ) : (
      <Response key={index}>
        <p>
          {part.parts.map((piece, at) =>
            typeof piece === "string" ? (
              <React.Fragment key={at}>{piece}</React.Fragment>
            ) : (
              <Citation
                key={at}
                href={`#${piece.site}`}
                target="_self"
                title={piece.title}
                site={piece.site}
                description={piece.description}
                onClick={(event) => {
                  event.preventDefault()
                  onShowSources()
                }}
              >
                {piece.label}
              </Citation>
            )
          )}
        </p>
      </Response>
    )
  )
}

function Activity({ turn }: { turn: AssistantTurn }) {
  const tools = turn.tools
  if (!tools) return null
  const running = tools.steps.some((step) => step.status === "running")
  return (
    <ToolActivity defaultOpen>
      <ToolActivitySummary icon={<WrenchIcon />} active={turn.live && running}>
        {turn.live ? `Working, ${tools.steps.length} ${tools.steps.length === 1 ? "step" : "steps"} so far` : tools.summary}
      </ToolActivitySummary>
      <ToolActivityContent aria-label="Steps">
        {tools.steps.map((step) => (
          <ToolCall key={step.id} status={step.status} defaultOpen={step.id === tools.expanded}>
            <ToolCallIcon>
              <ToolGlyph glyph={step.glyph} />
            </ToolCallIcon>
            <ToolCallTitle verb={step.verb}>{step.object}</ToolCallTitle>
            {step.request && step.response ? (
              <ToolCallDetail>
                <ToolCallSection title="Request">
                  <Pairs pairs={step.request} layout="stacked" />
                </ToolCallSection>
                <ToolCallSection title="Response">
                  <Pairs pairs={step.response} layout="rows" />
                </ToolCallSection>
              </ToolCallDetail>
            ) : null}
          </ToolCall>
        ))}
      </ToolActivityContent>
    </ToolActivity>
  )
}

function Ask({ turn }: { turn: AssistantTurn }) {
  const ask = turn.confirmation
  if (!ask) return null
  return (
    <Confirmation state={ask.state} outcome={ask.outcome}>
      <ConfirmationIcon>
        <CalendarIcon />
      </ConfirmationIcon>
      <ConfirmationTitle>{ask.title}</ConfirmationTitle>
      <ConfirmationDescription>{ask.description}</ConfirmationDescription>
      <ConfirmationDetails>
        <Pairs pairs={ask.details} layout="rows" />
      </ConfirmationDetails>
      <ConfirmationActions>
        <Button variant="bezeled" tone="neutral" onClick={() => answer("deny")}>
          Deny
        </Button>
        <Button variant="bezeled" tone="neutral" onClick={() => answer("always")}>
          Always Allow
        </Button>
        <Button variant="filled" onClick={() => answer("once")}>
          Allow Once
        </Button>
      </ConfirmationActions>
    </Confirmation>
  )
}

function CoverImages({ images }: { images: NonNullable<AssistantTurn["images"]> }) {
  return (
    <GeneratedImage defaultValue={images.seeds[1]} aspectRatio={4 / 3} aria-label={images.prompt}>
      <GeneratedImageStage>
        {(value) => (
          <Artwork
            seed={value ?? images.seeds[0]}
            palette="ocean"
            variant="aurora"
            aspect={4 / 3}
            title={`${images.prompt}, option ${images.seeds.indexOf(value ?? images.seeds[0]) + 1}`}
          />
        )}
      </GeneratedImageStage>
      <GeneratedImageActions>
        <Button variant="glass" size="sm" shape="capsule">
          <PencilIcon aria-hidden="true" />
          Edit
        </Button>
        <Button variant="glass" size="sm" shape="circle" aria-label="Share image">
          <ShareIcon aria-hidden="true" />
        </Button>
      </GeneratedImageActions>
      <GeneratedImageThumbnails aria-label="Options">
        {images.seeds.map((seed, index) => (
          <GeneratedImageThumbnail key={seed} value={seed} aria-label={`Option ${index + 1}`}>
            <Artwork seed={seed} palette="ocean" variant="aurora" />
          </GeneratedImageThumbnail>
        ))}
      </GeneratedImageThumbnails>
    </GeneratedImage>
  )
}

function Actions({ turn, prompt }: { turn: AssistantTurn; prompt: string }) {
  return (
    <MessageActions>
      <MessageActionCopy text={() => plainText(turn)} />
      <MessageAction label="Read Aloud">
        <Volume2Icon aria-hidden="true" />
      </MessageAction>
      <MessageActionToggle label="Good Response">
        <ThumbsUpIcon aria-hidden="true" />
      </MessageActionToggle>
      <MessageActionToggle label="Bad Response">
        <ThumbsDownIcon aria-hidden="true" />
      </MessageActionToggle>
      <MessageAction label="Try Again" onClick={() => send(prompt)}>
        <RotateCcwIcon aria-hidden="true" />
      </MessageAction>
      <MessageActionMenu label="More">
        <MenuItem value="branch">
          <MenuItemIcon>
            <GitBranchIcon />
          </MenuItemIcon>
          Branch in New Chat
        </MenuItem>
        <MenuItem value="share">
          <MenuItemIcon>
            <ShareIcon />
          </MenuItemIcon>
          Share…
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="report">
          <MenuItemIcon>
            <FlagIcon />
          </MenuItemIcon>
          Report…
        </MenuItem>
      </MessageActionMenu>
    </MessageActions>
  )
}

function AssistantMessage({ turn, prompt, latest }: { turn: AssistantTurn; prompt: string; latest: boolean }) {
  const { onShowSources } = React.useContext(ThreadContext)
  const reasoning = turn.reasoning
  const writing = Boolean(turn.live) && !reasoning && !turn.tools && turn.parts.length === 0
  return (
    <Message from="assistant" latest={latest}>
      <MessageContent className="ex-ai-reply">
        {writing ? (
          <Reasoning state="running" glow>
            <ReasoningTrigger />
          </Reasoning>
        ) : null}
        {reasoning ? (
          <Reasoning state={reasoning.state} duration={reasoning.duration} glow={turn.live}>
            <ReasoningTrigger>
              {reasoning.state === "done" ? `Worked for ${formatDuration(reasoning.duration)}` : undefined}
            </ReasoningTrigger>
            <ReasoningContent>
              <p>{reasoning.text}</p>
            </ReasoningContent>
          </Reasoning>
        ) : null}
        <Activity turn={turn} />
        <Ask turn={turn} />
        {turn.images ? <CoverImages images={turn.images} /> : null}
        <ReplyParts parts={turn.parts} streaming={Boolean(turn.live)} />
        {turn.sources ? (
          <Sources>
            <SourcesTrigger count={turn.sources.length} />
            <SourcesContent>
              {turn.sources.map((source) => (
                <Source
                  key={source.site}
                  href={`#${source.site}`}
                  target="_self"
                  site={source.site}
                  onClick={(event) => {
                    event.preventDefault()
                    onShowSources()
                  }}
                >
                  {source.title}
                </Source>
              ))}
            </SourcesContent>
          </Sources>
        ) : null}
        {turn.artifact ? (
          <ArtifactCard>
            <ArtifactCardIcon color="blue">
              <FileTextIcon />
            </ArtifactCardIcon>
            <ArtifactCardTitle render={<button type="button" onClick={onShowSources} />}>{turn.artifact.title}</ArtifactCardTitle>
            <ArtifactCardMeta>{turn.artifact.meta}</ArtifactCardMeta>
            <ArtifactCardActions>
              <ArtifactCardAction label="Download">
                <DownloadIcon aria-hidden="true" />
              </ArtifactCardAction>
            </ArtifactCardActions>
          </ArtifactCard>
        ) : null}
      </MessageContent>
      {turn.live ? null : (
        <>
          <Actions turn={turn} prompt={prompt} />
          {turn.stopped ? <MessageMeta>Stopped</MessageMeta> : null}
        </>
      )}
    </Message>
  )
}

type ThreadProps = {
  turns: Turn[]
  title: string
  busy: boolean
  onShowSources: () => void
  className?: string
  style?: React.CSSProperties
  /** The composer, when it floats over the thread (iPhone). */
  children?: React.ReactNode
}

/** The conversation: it follows the reply while you're at the end of it. */
function Thread({ turns, title, busy, onShowSources, className, style, children }: ThreadProps) {
  const actions = React.useMemo(() => ({ onShowSources }), [onShowSources])
  const viewport = React.useRef<HTMLDivElement>(null)
  const lastSent = [...turns].reverse().find((turn) => turn.from === "user")?.id
  const seen = React.useRef(lastSent)
  // Sending brings the thread to its end, even if you'd scrolled up to read; from there it follows the reply.
  React.useEffect(() => {
    if (lastSent === seen.current) return
    seen.current = lastSent
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: "smooth" })
  }, [lastSent])
  return (
    <ThreadContext.Provider value={actions}>
      <Chat busy={busy} className={className} style={style}>
        <ChatViewport ref={viewport} aria-label={title}>
          <ChatContent>
            {turns.map((turn, index) => {
              const latest = index === turns.length - 1
              if (turn.from === "user") return <UserMessage key={turn.id} turn={turn} latest={latest} />
              const prompt = turns
                .slice(0, index)
                .reverse()
                .find((entry): entry is UserTurn => entry.from === "user")?.text
              return <AssistantMessage key={turn.id} turn={turn} prompt={prompt ?? ""} latest={latest} />
            })}
          </ChatContent>
        </ChatViewport>
        <ChatScrollButton />
        {children}
      </Chat>
    </ThreadContext.Provider>
  )
}

export { Thread }
