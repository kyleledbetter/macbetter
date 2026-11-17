"use client"

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import * as React from "react"
import { cx, join } from "../lib/cx"

type ChatProps = React.ComponentProps<typeof ScrollArea> & {
  /**
   * Set while a reply streams. The log is marked busy, so screen readers wait
   * and read the finished reply instead of each word as it arrives.
   */
  busy?: boolean
}

const ChatBusyContext = React.createContext(false)

/** The thread. It follows the reply while you're at the end and lets go when you scroll up. */
function Chat({ stickToEnd = true, type = "hover", busy, className, children, ...props }: ChatProps) {
  return (
    <ScrollArea
      stickToEnd={stickToEnd}
      type={type}
      data-busy={busy ? "" : undefined}
      className={cx("mb-chat", className)}
      {...props}
    >
      {(state) => (
        <ChatBusyContext.Provider value={Boolean(busy)}>
          {typeof children === "function" ? children(state) : children}
          <ScrollAreaScrollbar orientation="vertical" className="mb-scroll-view-scrollbar mb-chat-scrollbar">
            <ScrollAreaThumb className="mb-scroll-view-thumb" />
          </ScrollAreaScrollbar>
        </ChatBusyContext.Provider>
      )}
    </ScrollArea>
  )
}

/** The scrolling log of turns. Name it with `aria-label`. */
function ChatViewport({
  "aria-label": ariaLabel = "Conversation",
  className,
  ...props
}: React.ComponentProps<typeof ScrollAreaViewport>) {
  const busy = React.useContext(ChatBusyContext)
  return (
    <ScrollAreaViewport
      role="log"
      aria-live="polite"
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      className={cx("mb-chat-viewport", className)}
      {...props}
    />
  )
}

/** The centered column the turns sit in, with even gaps between them. */
function ChatContent({ className, ...props }: React.ComponentProps<typeof ScrollAreaContent>) {
  return <ScrollAreaContent className={cx("mb-chat-content", className)} {...props} />
}

/** A floating glass button that jumps back to the latest turn. It shows only once you've scrolled away. */
function ChatScrollButton({
  "aria-label": ariaLabel = "Scroll to latest",
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaScrollToEnd>) {
  return (
    <ScrollAreaScrollToEnd
      type="button"
      aria-label={ariaLabel}
      className={cx("mb-glass mb-chat-scroll-button", className)}
      data-shape="circle"
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path
            d="M8 2.75v10.5M3.5 8.75 8 13.25l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </ScrollAreaScrollToEnd>
  )
}

type ChatGreetingProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** A mark above the title, like your app's icon. Decorative. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** The title's heading level. A new-chat screen's greeting is usually its page heading. */
  level?: 1 | 2 | 3
}

/** The empty state of a new chat: a large greeting, with the composer and suggestions as children. */
function ChatGreeting({ icon, title, description, level = 1, className, children, ...props }: ChatGreetingProps) {
  const Heading = `h${level}` as const
  return (
    <div className={join("mb-chat-greeting", className)} {...props}>
      {icon ? (
        <div aria-hidden="true" className="mb-chat-greeting-icon">
          {icon}
        </div>
      ) : null}
      <Heading className="mb-chat-greeting-title">{title}</Heading>
      {description ? <p className="mb-chat-greeting-description">{description}</p> : null}
      {children ? <div className="mb-chat-greeting-body">{children}</div> : null}
    </div>
  )
}

export { Chat, ChatContent, ChatGreeting, ChatScrollButton, ChatViewport }
export type { ChatGreetingProps, ChatProps }
