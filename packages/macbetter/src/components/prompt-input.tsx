"use client"

import {
  createFileInputController,
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  formatFileSize,
} from "@ui-sdk/react/file-input"
import { Textarea } from "@ui-sdk/react/textarea"
import {
  type TextEditorAdapter,
  type TriggerDefinition,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuList,
  TriggerMenuStatus,
  textFieldAdapter,
} from "@ui-sdk/react/trigger-menu"
import * as React from "react"
import { cx, join } from "../lib/cx"
import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview } from "./attachment"
import { Button, type ButtonProps } from "./button"
import { Menu, MenuContent, MenuItem, MenuItemIcon, type MenuProps, MenuTrigger } from "./menu"

/** A suggestion source for `PromptInputField`'s `triggers`: ui-sdk Trigger Menu's trigger definition. */
type PromptInputTrigger = TriggerDefinition

type PromptInputStatus = "ready" | "submitted" | "streaming" | "error"

type PromptInputMessage = { text: string; files: File[] }

type PromptInputContextValue = {
  status: PromptInputStatus
  busy: boolean
  empty: boolean
  disabled: boolean
  text: string
  setText: (text: string) => void
  files: readonly File[]
  fieldRef: React.RefObject<HTMLTextAreaElement | null>
  openFiles: () => void
  stop: () => void
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null)

function usePromptInput(part: string) {
  const context = React.useContext(PromptInputContext)
  if (!context) throw new Error(`${part} must be inside a PromptInput.`)
  return context
}

type PromptInputProps = Omit<React.ComponentProps<"form">, "onSubmit" | "defaultValue"> & {
  /** Where the reply is: `submitted` and `streaming` turn the submit button into Stop. */
  status?: PromptInputStatus
  /** Runs with what's typed and attached when the person sends. The field and files clear after. */
  onSubmit?: (message: PromptInputMessage) => void
  /** Runs when the person presses Stop while a reply is on its way. */
  onStop?: () => void
  /** `lg` is the tall composer of a new chat; `md` starts at one line and grows. */
  size?: "md" | "lg"
  /** A soft moving halo in the theme's colors while the reply is on its way. Holds still under Reduce Motion. */
  glow?: boolean
  /** Floats the composer over the bottom of a `Chat`, as on iOS. */
  floating?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (text: string) => void
  files?: File[]
  defaultFiles?: File[]
  onFilesChange?: (files: File[]) => void
  /** The files it takes, like the `accept` attribute. Any file without it. */
  accept?: string
  maxFiles?: number
  /** The largest file accepted, in bytes. */
  maxSize?: number
  disabled?: boolean
}

/**
 * The composer. Return sends, Shift-Return adds a line, and files come in from the
 * add button, a drop or a paste. `PromptInputAccessory` children are placed under it.
 */
function PromptInput({
  status = "ready",
  onSubmit,
  onStop,
  size = "md",
  glow,
  floating,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  files: filesProp,
  defaultFiles,
  onFilesChange,
  accept,
  maxFiles,
  maxSize,
  disabled = false,
  className,
  children,
  ...props
}: PromptInputProps) {
  const [ownText, setOwnText] = React.useState(defaultValue)
  const text = valueProp ?? ownText
  const [ownFiles, setOwnFiles] = React.useState<File[]>(defaultFiles ?? [])
  const files = filesProp ?? ownFiles
  const [controller] = React.useState(createFileInputController)
  const fieldRef = React.useRef<HTMLTextAreaElement | null>(null)
  const formRef = React.useRef<HTMLFormElement | null>(null)

  // A floating composer tells its Chat how much room it covers, so the last turn and the
  // jump button clear it however many lines the field has grown to.
  React.useEffect(() => {
    const form = formRef.current
    const chat = floating ? form?.closest<HTMLElement>(".mb-chat") : null
    if (!form || !chat || typeof ResizeObserver === "undefined") return
    const measure = () => {
      const room = chat.getBoundingClientRect().bottom - form.getBoundingClientRect().top
      chat.style.setProperty("--mb-chat-inset-bottom", `${Math.max(0, Math.round(room))}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(form)
    observer.observe(chat)
    return () => {
      observer.disconnect()
      chat.style.removeProperty("--mb-chat-inset-bottom")
    }
  }, [floating])

  const setText = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setOwnText(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )
  const setFiles = (next: File[]) => {
    if (filesProp === undefined) setOwnFiles(next)
    onFilesChange?.(next)
  }

  const busy = status === "submitted" || status === "streaming"
  const empty = text.trim() === "" && files.length === 0
  const glowing = Boolean(glow) && busy

  const context: PromptInputContextValue = {
    status,
    busy,
    empty,
    disabled,
    text,
    setText,
    files,
    fieldRef,
    openFiles: () => controller.open(),
    stop: () => onStop?.(),
  }

  const inside: React.ReactNode[] = []
  const under: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === PromptInputAccessory) under.push(child)
    else inside.push(child)
  })

  return (
    <PromptInputContext.Provider value={context}>
      <form
        noValidate
        data-size={size}
        data-status={status}
        data-glow={glow ? "" : undefined}
        data-glowing={glowing ? "" : undefined}
        data-floating={floating ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={join("mb-prompt-input", className)}
        {...props}
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault()
          if (busy || empty || disabled) return
          onSubmit?.({ text, files: [...files] })
          setText("")
          setFiles([])
        }}
      >
        <FileInput
          multiple
          accept={accept}
          maxFiles={maxFiles}
          maxSize={maxSize}
          disabled={disabled}
          controller={controller}
          value={files}
          onValueChange={(next) => setFiles([...next])}
          className="mb-prompt-input-files"
        >
          <FileInputDropzone className="mb-prompt-input-box" pasteTarget={() => fieldRef.current}>
            {inside}
          </FileInputDropzone>
        </FileInput>
        {under}
      </form>
    </PromptInputContext.Provider>
  )
}

type PromptInputFieldProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onValueChange" | "submitShortcut" | "onSubmit"
> & {
  /**
   * Suggestions at the caret, like `@` for people or files and `/` for commands. Each is a
   * ui-sdk Trigger Menu trigger: `{ char, items, boundary? }`, with items as data or a loader.
   */
  triggers?: PromptInputTrigger[]
  /** What the suggestion list says when nothing matches. Leave out to close it instead. */
  triggerEmpty?: React.ReactNode
  /** The most lines it grows to before it scrolls. */
  maxRows?: number
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") ref(value)
  else if (ref) (ref as React.RefObject<T>).current = value
}

/** The text field. It grows with what's typed. */
function PromptInputField({
  "aria-label": ariaLabel = "Message",
  triggers,
  triggerEmpty,
  maxRows,
  rows,
  ref,
  className,
  style,
  disabled,
  ...props
}: PromptInputFieldProps) {
  const context = usePromptInput("PromptInputField")
  const [editor, setEditor] = React.useState<TextEditorAdapter>()
  const lines = maxRows ? ({ "--mb-prompt-input-max-rows": maxRows } as React.CSSProperties) : undefined

  const field = (
    <Textarea
      ref={(element: HTMLTextAreaElement | null) => {
        context.fieldRef.current = element
        assignRef(ref, element)
        if (triggers && element && editor?.element !== element) setEditor(textFieldAdapter(element))
      }}
      autoResize
      rows={rows ?? 1}
      submitShortcut="enter"
      aria-label={ariaLabel}
      disabled={disabled ?? context.disabled}
      value={context.text}
      onValueChange={(next) => context.setText(next)}
      className={cx("mb-prompt-input-field", className)}
      style={
        lines
          ? typeof style === "function"
            ? (state) => ({ ...lines, ...style(state) })
            : { ...lines, ...style }
          : style
      }
      {...props}
    />
  )

  if (!triggers) return field

  return (
    <TriggerMenu editor={editor} triggers={triggers}>
      {field}
      <TriggerMenuStatus className="mb-visually-hidden" />
      <TriggerMenuContent side="top" align="start" sideOffset={6} className="mb-menu-content mb-prompt-input-suggestions">
        {triggerEmpty ? <TriggerMenuEmpty className="mb-prompt-input-suggestions-empty">{triggerEmpty}</TriggerMenuEmpty> : null}
        <TriggerMenuList className="mb-prompt-input-suggestions-list" />
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

/** The files attached so far, as chips above the field. Arrow keys move between them; Delete removes one. */
function PromptInputAttachments({
  "aria-label": ariaLabel = "Attachments",
  className,
  ...props
}: Omit<React.ComponentProps<typeof FileInputList>, "children">) {
  const { files } = usePromptInput("PromptInputAttachments")
  if (files.length === 0) return null
  return (
    <FileInputList aria-label={ariaLabel} className={cx("mb-prompt-input-attachments", className)} {...props}>
      <FileInputItem className="mb-prompt-input-attachment">
        {({ file }) => <PromptInputAttachmentChip file={file} />}
      </FileInputItem>
    </FileInputList>
  )
}

function PromptInputAttachmentChip({ file }: { file: File }) {
  const image = file.type.startsWith("image/")
  const [url, setUrl] = React.useState<string>()
  React.useEffect(() => {
    if (!image || typeof URL.createObjectURL !== "function") return
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file, image])
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toUpperCase().slice(0, 4) : undefined

  return (
    <Attachment variant="chip">
      <AttachmentPreview src={url} extension={image ? undefined : extension} />
      <AttachmentName>{file.name}</AttachmentName>
      <AttachmentMeta>{formatFileSize(file.size)}</AttachmentMeta>
      <FileInputItemRemove className="mb-attachment-remove">
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="m4.75 4.75 6.5 6.5m0-6.5-6.5 6.5" />
        </svg>
      </FileInputItemRemove>
    </Attachment>
  )
}

/** The row under the field: leading and trailing `PromptInputTools`. */
function PromptInputToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-prompt-input-toolbar", className)} {...props} />
}

/** A cluster of controls in the toolbar. The first sits at the leading edge, the last at the trailing edge. */
function PromptInputTools({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-prompt-input-tools", className)} {...props} />
}

type PromptInputButtonProps = ButtonProps & {
  /** Names the icon-only button, like "Dictate". */
  "aria-label": string
}

/** A plain round icon button for the toolbar, like dictation or voice. */
function PromptInputButton({
  variant = "plain",
  tone = "neutral",
  shape = "circle",
  type = "button",
  className,
  ...props
}: PromptInputButtonProps) {
  return (
    <Button
      variant={variant}
      tone={tone}
      shape={shape}
      type={type}
      className={cx("mb-prompt-input-button", className)}
      {...props}
    />
  )
}

type PromptInputAddProps = Omit<MenuProps, "children"> & {
  /** Names the button. */
  label?: string
  /** The menu item that opens the file picker. */
  filesLabel?: string
  /** Leaves out the built-in files item, for a menu of your own items only. */
  hideFiles?: boolean
  disabled?: boolean
  className?: string
  /** More menu items, after Add photos and files. */
  children?: React.ReactNode
}

/** The add button. It opens a menu whose first item picks photos and files. */
function PromptInputAdd({
  label = "Add",
  filesLabel = "Add photos and files",
  hideFiles,
  disabled,
  className,
  presentation = "auto",
  onAction,
  children,
  ...props
}: PromptInputAddProps) {
  const context = usePromptInput("PromptInputAdd")
  return (
    <Menu
      presentation={presentation}
      onAction={(value, details) => {
        if (value === "mb-prompt-input-files") context.openFiles()
        return onAction?.(value, details)
      }}
      {...props}
    >
      <MenuTrigger
        variant="plain"
        tone="neutral"
        shape="circle"
        indicator={false}
        aria-label={label}
        disabled={disabled ?? context.disabled}
        className={join("mb-prompt-input-button mb-prompt-input-add", className)}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M8 2.75v10.5M2.75 8h10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </MenuTrigger>
      <MenuContent side="top" align="start" className="mb-prompt-input-add-menu">
        {hideFiles ? null : (
          <MenuItem value="mb-prompt-input-files">
            <MenuItemIcon>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                <path
                  d="m13.2 7.6-5.15 5.15a3.25 3.25 0 0 1-4.6-4.6l5.3-5.3a2.17 2.17 0 0 1 3.07 3.07L6.6 11.15a1.08 1.08 0 0 1-1.53-1.53l4.8-4.8"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </MenuItemIcon>
            {filesLabel}
          </MenuItem>
        )}
        {children}
      </MenuContent>
    </Menu>
  )
}

type PromptInputSubmitProps = Omit<ButtonProps, "children" | "type"> & {
  sendLabel?: string
  stopLabel?: string
}

/** Sends the message. While a reply is on its way it's a Stop button that calls `onStop`. */
function PromptInputSubmit({
  sendLabel = "Send",
  stopLabel = "Stop",
  variant = "filled",
  tone = "accent",
  shape = "circle",
  size = "sm",
  disabled,
  className,
  onClick,
  ...props
}: PromptInputSubmitProps) {
  const context = usePromptInput("PromptInputSubmit")
  const stopping = context.busy
  return (
    <Button
      type={stopping ? "button" : "submit"}
      variant={variant}
      tone={stopping ? "neutral" : tone}
      shape={shape}
      size={size}
      aria-label={stopping ? stopLabel : sendLabel}
      disabled={disabled ?? (context.disabled || (!stopping && context.empty))}
      data-status={context.status}
      className={cx("mb-prompt-input-submit", className)}
      onClick={(event, ...rest) => {
        onClick?.(event, ...rest)
        if (stopping && !event.defaultPrevented) context.stop()
      }}
      {...props}
    >
      {stopping ? (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <rect x="4" y="4" width="8" height="8" rx="1.75" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path
            d="M8 13.25V2.9M3.6 7.2 8 2.75l4.4 4.45"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Button>
  )
}

/** The strip attached under the composer: context chips on the leading side, an action on the trailing side. */
function PromptInputAccessory({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-prompt-input-accessory", className)} {...props} />
}

export {
  PromptInput,
  PromptInputAccessory,
  PromptInputAdd,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputField,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
}
export type {
  PromptInputAddProps,
  PromptInputButtonProps,
  PromptInputFieldProps,
  PromptInputMessage,
  PromptInputProps,
  PromptInputStatus,
  PromptInputSubmitProps,
  PromptInputTrigger,
}
