"use client"

import { Avatar } from "macbetter/avatar"
import { MenuItem, MenuItemIcon, MenuSeparator } from "macbetter/menu"
import { TextArea } from "macbetter/text-area"
import { TextField } from "macbetter/text-field"
import {
  ArchiveIcon,
  FlagIcon,
  ForwardIcon,
  MailIcon,
  MailOpenIcon,
  OctagonXIcon,
  PaperclipIcon,
  ReplyAllIcon,
  ReplyIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"
import { preview, type Message } from "./data"
import { composeDefaults, type Compose } from "./store"

function MessageSummary({ message }: { message: Message }) {
  return (
    <>
      <span aria-hidden="true" className="ex-mail-dot" data-unread={message.unread ? "" : undefined} />
      <span className="ex-mail-row-top">
        <span className="ex-mail-from">
          {message.unread ? <span className="mb-visually-hidden">Unread, </span> : null}
          {message.from}
        </span>
        {message.attachment ? <PaperclipIcon aria-label="Has attachment" className="ex-mail-glyph" /> : null}
        {message.flagged ? <FlagIcon aria-label="Flagged" className="ex-mail-glyph ex-mail-flag" /> : null}
        <span className="ex-mail-time">{message.time}</span>
      </span>
      <span className="ex-mail-subject">{message.subject}</span>
      <span className="ex-mail-preview">{preview(message)}</span>
    </>
  )
}

function Reader({ message, compact }: { message: Message | undefined; compact?: boolean }) {
  if (!message) {
    return (
      <div className="ex-empty">
        <MailIcon aria-hidden="true" className="ex-empty-glyph" />
        <strong>No message selected</strong>
      </div>
    )
  }
  return (
    <article className="ex-reader" data-compact={compact ? "" : undefined} aria-labelledby={`subject-${message.id}`}>
      <header className="ex-reader-header">
        <Avatar name={message.from} color="auto" size={compact ? "md" : "lg"} />
        <div className="ex-reader-meta">
          <div className="ex-reader-from">
            {message.from}
            <span className="ex-reader-time">
              {message.date === "Today" ? message.time : message.date}
            </span>
          </div>
          <div className="ex-reader-line">To: {message.to}</div>
        </div>
      </header>
      <h2 id={`subject-${message.id}`} className="ex-reader-subject">
        {message.subject}
        {message.flagged ? <FlagIcon aria-label="Flagged" className="ex-mail-flag" /> : null}
      </h2>
      <div className="ex-reader-body">
        {message.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {message.attachment ? (
        <div className="ex-attachment">
          <span className="ex-attachment-icon" aria-hidden="true">
            PDF
          </span>
          <span>
            <span className="ex-attachment-name">{message.attachment.name}</span>
            <span className="ex-attachment-size">{message.attachment.size}</span>
          </span>
        </div>
      ) : null}
    </article>
  )
}

/** The actions on a message, shared by the context menu and the pull-down menus. */
function MessageMenuItems({ message, reply = true }: { message: Message; reply?: boolean }) {
  return (
    <>
      {reply ? (
        <>
          <MenuItem value="reply">
            <MenuItemIcon>
              <ReplyIcon />
            </MenuItemIcon>
            Reply
          </MenuItem>
          <MenuItem value="reply-all">
            <MenuItemIcon>
              <ReplyAllIcon />
            </MenuItemIcon>
            Reply All
          </MenuItem>
          <MenuItem value="forward">
            <MenuItemIcon>
              <ForwardIcon />
            </MenuItemIcon>
            Forward
          </MenuItem>
          <MenuSeparator />
        </>
      ) : null}
      <MenuItem value="toggle-read">
        <MenuItemIcon>{message.unread ? <MailOpenIcon /> : <MailIcon />}</MenuItemIcon>
        {message.unread ? "Mark as Read" : "Mark as Unread"}
      </MenuItem>
      <MenuItem value="toggle-flag">
        <MenuItemIcon>
          <FlagIcon />
        </MenuItemIcon>
        {message.flagged ? "Unflag" : "Flag"}
      </MenuItem>
      <MenuSeparator />
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
        Move to Junk
      </MenuItem>
      <MenuItem value="trash" className="ex-menu-destructive">
        <MenuItemIcon>
          <Trash2Icon />
        </MenuItemIcon>
        Delete
      </MenuItem>
    </>
  )
}

const composeTitles = { new: "New Message", reply: "Reply", "reply-all": "Reply All", forward: "Forward" }

function composeTitle(compose: NonNullable<Compose>) {
  return compose.mode === "new" ? "New Message" : composeDefaults(compose).subject || composeTitles[compose.mode]
}

/** To, Subject and the message. Keyed by the compose request so it starts fresh each time. */
function ComposeFields({ compose, onToChange }: { compose: NonNullable<Compose>; onToChange?: (to: string) => void }) {
  const defaults = composeDefaults(compose)
  return (
    <div className="ex-compose">
      <label className="ex-compose-field">
        <span>To:</span>
        <TextField
          variant="plain"
          defaultValue={defaults.to}
          autoFocus={!defaults.to}
          onChange={(event) => onToChange?.(event.currentTarget.value)}
        />
      </label>
      <label className="ex-compose-field">
        <span>Subject:</span>
        <TextField variant="plain" defaultValue={defaults.subject} />
      </label>
      <TextArea
        aria-label="Message"
        className="ex-compose-body"
        defaultValue={defaults.body}
        minRows={8}
        autoFocus={Boolean(defaults.to)}
      />
    </div>
  )
}

function useComposeRecipient(compose: Compose) {
  const [to, setTo] = React.useState("")
  React.useEffect(() => {
    if (compose) setTo(composeDefaults(compose).to)
  }, [compose])
  return [to, setTo] as const
}

export { ComposeFields, composeTitle, MessageMenuItems, MessageSummary, Reader, useComposeRecipient }
