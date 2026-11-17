"use client"

import { Button } from "macbetter/button"
import { MenuItem, MenuItemIcon } from "macbetter/menu"
import { ModelPicker } from "macbetter/model-picker"
import {
  PromptInput,
  PromptInputAdd,
  PromptInputButton,
  PromptInputField,
  type PromptInputStatus,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "macbetter/prompt-input"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "macbetter/reasoning"
import { Citation, Source, Sources, SourcesContent, SourcesTrigger } from "macbetter/sources"
import { Suggestion, Suggestions } from "macbetter/suggestion"
import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"
import {
  ToolActivity,
  ToolActivityContent,
  ToolActivitySummary,
  ToolCall,
  ToolCallDetail,
  ToolCallSection,
  ToolCallTitle,
} from "macbetter/tool-call"
import { CameraIcon, DatabaseIcon, FolderIcon, MicIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { MoreLink } from "@/components/more-link"
import ArtifactCards from "@/demos/ai/artifact-card-basic"
import GeneratedImageDemo from "@/demos/ai/generated-image-basic"
import MessageThread from "@/demos/ai/message-basic"
import ModelPickerDemo from "@/demos/ai/model-picker-basic"
import PlanDemo from "@/demos/ai/plan-basic"
import { SectionHeading } from "./section-heading"
import { Tile } from "./tile"

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
]
const efforts = [
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
]

/** The composer, with a stand-in reply so the glow shows when someone sends. */
function Composer() {
  const [status, setStatus] = useState<PromptInputStatus>("ready")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function send() {
    setStatus("submitted")
    timers.current = [setTimeout(() => setStatus("streaming"), 500), setTimeout(() => setStatus("ready"), 5500)]
  }
  function stop() {
    timers.current.forEach(clearTimeout)
    setStatus("ready")
  }

  return (
    <div className="lp-ai-composer">
      <PromptInput
        size="lg"
        status={status}
        glow
        defaultValue="Plan two days in Sintra for a family of four"
        onSubmit={send}
        onStop={stop}
      >
        <PromptInputField placeholder="Ask anything" aria-label="Message" />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputAdd>
              <MenuItem value="camera">
                <MenuItemIcon>
                  <CameraIcon aria-hidden="true" />
                </MenuItemIcon>
                Take a photo
              </MenuItem>
              <MenuItem value="project">
                <MenuItemIcon>
                  <FolderIcon aria-hidden="true" />
                </MenuItemIcon>
                Add from a project
              </MenuItem>
            </PromptInputAdd>
          </PromptInputTools>
          <PromptInputTools>
            <ModelPicker models={models} efforts={efforts} defaultEffort="high" />
            <PromptInputButton aria-label="Dictate">
              <MicIcon aria-hidden="true" />
            </PromptInputButton>
            <PromptInputSubmit />
          </PromptInputTools>
        </PromptInputToolbar>
      </PromptInput>
      <p className="lp-ai-hint" aria-live="polite">
        {status === "ready" ? "Press Return to send." : "Replying… press Stop to end it."}
      </p>
    </div>
  )
}

/** Thinks for a moment once it scrolls into view, then settles. "Think again" restarts it. */
function Thinking() {
  const ref = useRef<HTMLDivElement>(null)
  const [running, setRunning] = useState(false)
  const [runs, setRuns] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRunning(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setRunning(false), 3600)
    return () => clearTimeout(timer)
  }, [running, runs])

  return (
    <div ref={ref} className="lp-ai-reasoning">
      <Reasoning state={running ? "running" : "done"} duration={12} glow>
        <ReasoningTrigger />
        <ReasoningContent>
          <p>
            Four people need two rooms for one night. The calendar is free on Saturday and Sunday, and Pena Palace
            opens at 9:30, so the first morning starts there.
          </p>
        </ReasoningContent>
      </Reasoning>
      <Button
        size="sm"
        disabled={running}
        onClick={() => {
          setRuns((value) => value + 1)
          setRunning(true)
        }}
      >
        Think again
      </Button>
    </div>
  )
}

function Tools() {
  return (
    <ToolActivity defaultOpen className="lp-ai-tools">
      <ToolActivitySummary icon={<DatabaseIcon />}>Used Dataroom, read a file · 29s</ToolActivitySummary>
      <ToolActivityContent>
        <ToolCall>
          <ToolCallTitle verb="Read">data-workflows.md</ToolCallTitle>
        </ToolCall>
        <ToolCall>
          <ToolCallTitle>Searching the catalog for usage tables.</ToolCallTitle>
        </ToolCall>
        <ToolCall defaultOpen>
          <ToolCallTitle verb="Listed datasets">finance-reporting</ToolCallTitle>
          <ToolCallDetail>
            <ToolCallSection title="Request">
              <DescriptionList size="sm">
                <DescriptionItem>
                  <DescriptionTerm>Workspace</DescriptionTerm>
                  <DescriptionDetails mono>finance-reporting</DescriptionDetails>
                </DescriptionItem>
              </DescriptionList>
            </ToolCallSection>
            <ToolCallSection title="Response">
              <DescriptionList size="sm">
                <DescriptionItem>
                  <DescriptionTerm>Datasets</DescriptionTerm>
                  <DescriptionDetails>14</DescriptionDetails>
                </DescriptionItem>
                <DescriptionItem>
                  <DescriptionTerm>Largest</DescriptionTerm>
                  <DescriptionDetails mono>usage_daily</DescriptionDetails>
                </DescriptionItem>
              </DescriptionList>
            </ToolCallSection>
          </ToolCallDetail>
        </ToolCall>
      </ToolActivityContent>
    </ToolActivity>
  )
}

const followUps = ["Make it shorter", "Add a packing list", "Find vegetarian restaurants", "What if it rains?"]

function FollowUps() {
  const [chosen, setChosen] = useState<string | null>(null)
  return (
    <div className="lp-ai-suggestions">
      <Suggestions aria-label="Follow-up suggestions" layout="chips" onSelect={setChosen}>
        {followUps.map((text) => (
          <Suggestion key={text}>{text}</Suggestion>
        ))}
      </Suggestions>
      <p className="lp-ai-hint" aria-live="polite">
        {chosen ? `Sends “${chosen}”` : "Choose one to send it."}
      </p>
    </div>
  )
}

const sources = [
  { href: "https://tides.example.com/bay", site: "tides.example.com", title: "Tide tables for the north bay" },
  { href: "https://harbor.example.org/ferry", site: "harbor.example.org", title: "Ferry timetable, winter schedule" },
  { href: "https://weather.example.net/coast", site: "weather.example.net", title: "Coastal forecast for the weekend" },
  { href: "https://trails.example.com/cliff-walk", site: "trails.example.com", title: "Cliff walk: parking and access" },
]

function Cited() {
  return (
    <div className="lp-ai-sources">
      <p className="lp-ai-cited">
        Low tide on Saturday is at 11:40 AM, which leaves the cliff walk open until about 2 PM.
        <Citation href={sources[0].href} site={sources[0].site} title={sources[0].title}>
          1
        </Citation>{" "}
        The last ferry back leaves the north pier at 4:15 PM.
        <Citation href={sources[1].href} site={sources[1].site} title={sources[1].title}>
          2
        </Citation>
      </p>
      <Sources>
        <SourcesTrigger count={sources.length} />
        <SourcesContent>
          {sources.map((source) => (
            <Source key={source.href} href={source.href} site={source.site}>
              {source.title}
            </Source>
          ))}
        </SourcesContent>
      </Sources>
    </div>
  )
}

function AiBento() {
  return (
    <section id="ai" className="lp-section" aria-labelledby="lp-ai">
      <div className="lp-section-inner">
        <SectionHeading
          id="lp-ai"
          eyebrow="AI and Chat Components"
          headline={<>Everything you need to build a chat assistant that feels&nbsp;native.</>}
          links={
            <>
              <MoreLink href="/examples/assistant">See the AI Assistant example</MoreLink>
              <MoreLink href="/docs/ai/overview">Learn more about AI and chat components</MoreLink>
            </>
          }
        >
          A message thread and a composer, with reasoning, tool calls, sources, generated files and images, and the
          prompts that start a conversation. They stream in as the reply arrives and stay readable without motion.{" "}
          <strong>Every tile below is a working&nbsp;component.</strong>
        </SectionHeading>

        <div className="lp-bento lp-ai-bento lp-reveal" data-platform="macos">
          <Tile area="prompt" name="Prompt input" href="/docs/ai/prompt-input">
            <Composer />
          </Tile>
          <Tile area="model" name="Model picker" href="/docs/ai/model-picker">
            <div className="lp-ai-model">
              <ModelPickerDemo />
              <p className="lp-ai-hint">Choose a model and how long it thinks.</p>
            </div>
          </Tile>
          <Tile area="chat" name="Message" href="/docs/ai/message" className="lp-ai-fill">
            <MessageThread />
          </Tile>
          <Tile area="tool" name="Tool call" href="/docs/ai/tool-call" className="lp-ai-fill">
            <Tools />
          </Tile>
          <Tile area="reason" name="Reasoning" href="/docs/ai/reasoning" className="lp-ai-fill">
            <Thinking />
          </Tile>
          <Tile area="image" name="Generated image" href="/docs/ai/generated-image">
            <div className="lp-ai-image">
              <GeneratedImageDemo />
            </div>
          </Tile>
          <Tile area="sources" name="Sources" href="/docs/ai/sources" className="lp-ai-fill">
            <Cited />
          </Tile>
          <Tile area="suggest" name="Suggestions" href="/docs/ai/suggestion" className="lp-ai-fill">
            <FollowUps />
          </Tile>
          <Tile area="plan" name="Plan" href="/docs/ai/plan">
            <PlanDemo />
          </Tile>
          <Tile area="artifact" name="Artifact card" href="/docs/ai/artifact-card" className="lp-ai-artifact">
            <ArtifactCards />
          </Tile>
        </div>
      </div>
    </section>
  )
}

export { AiBento }
