"use client"

import { Button } from "macbetter/button"
import { CodeBlock, CodeBlockContent, CodeBlockCopy, CodeBlockHeader, CodeBlockTitle } from "macbetter/code-block"
import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "macbetter/menu"
import {
  Outline,
  OutlineGroup,
  OutlineItem,
  OutlineItemIcon,
  OutlineItemLabel,
  OutlineItemText,
} from "macbetter/outline"
import { ChevronRightIcon, CopyIcon, DownloadIcon, EllipsisIcon, FileIcon, FileTextIcon, FolderIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import * as React from "react"
import { Markdown } from "@/components/ai/markdown"
import { skillBody, skillFileContents, skillFolders, skills, type Skill } from "./data"
import { AppTile } from "./icons"

const languageNames: Record<string, string> = { md: "Markdown", css: "CSS", json: "JSON", sql: "SQL" }

/** The installed skills, as rows that open their detail. */
function SkillsList({ onOpen, title = true }: { onOpen: (skill: Skill) => void; title?: boolean }) {
  return (
    <div className="ex-ai-directory">
      {title ? (
        <header className="ex-ai-directory-header">
          <div className="ex-ai-directory-heading">
            <h1 className="ex-ai-directory-title">Skills</h1>
            <p className="ex-ai-directory-description">Instructions and files Assistant loads when a task calls for them.</p>
          </div>
          <div className="ex-ai-directory-controls">
            <Button variant="bezeled" tone="neutral" size="sm">
              <PlusIcon aria-hidden="true" />
              New Skill
            </Button>
          </div>
        </header>
      ) : null}
      <section className="ex-ai-section" aria-label="Installed skills">
        <h2 className="ex-ai-section-title">Installed</h2>
        <ul className="ex-ai-grid">
          {skills.map((skill) => (
            <li key={skill.id} className="ex-ai-row" data-interactive="">
              <AppTile glyph={skill.glyph} color={skill.color} />
              <span className="ex-ai-row-text">
                <button type="button" className="ex-ai-row-name ex-ai-row-button" onClick={() => onOpen(skill)}>
                  {skill.name}
                </button>
                <span className="ex-ai-row-description">{skill.description}</span>
              </span>
              <ChevronRightIcon aria-hidden="true" className="ex-ai-row-chevron" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function SkillFileView({ skill, path }: { skill: Skill; path: string }) {
  if (path === "SKILL.md") {
    return (
      <div className="ex-ai-skill-doc">
        <DescriptionList layout="rows" size="sm" className="ex-ai-skill-meta">
          <DescriptionItem>
            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails mono>{skill.name}</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Description</DescriptionTerm>
            <DescriptionDetails>{skill.description}</DescriptionDetails>
          </DescriptionItem>
        </DescriptionList>
        <Markdown>{skillBody(skill)}</Markdown>
      </div>
    )
  }
  const file = skillFolders.flatMap((folder) => folder.files).find((entry) => entry.path === path)
  const code = skillFileContents(skill, path)
  return (
    <CodeBlock className="ex-ai-skill-code">
      <CodeBlockHeader>
        <CodeBlockTitle language={file?.language ? languageNames[file.language] : undefined}>{file?.name}</CodeBlockTitle>
        <CodeBlockCopy value={code} />
      </CodeBlockHeader>
      <CodeBlockContent>{code}</CodeBlockContent>
    </CodeBlock>
  )
}

type SkillDetailProps = {
  skill: Skill
  /** The heading element for the skill's name: the dialog's title on the Mac, the sheet's on iPhone. */
  renderTitle: (name: string) => React.ReactNode
  onClose: () => void
  onTry: () => void
}

/** A skill's header, its files as a tree beside the open file, and its actions. */
function SkillDetail({ skill, renderTitle, onClose, onTry }: SkillDetailProps) {
  const [path, setPath] = React.useState("SKILL.md")
  return (
    <div className="ex-ai-skill">
      <div className="ex-ai-skill-header">
        <AppTile glyph={skill.glyph} color={skill.color} className="ex-ai-skill-icon" />
        <div className="ex-ai-skill-heading">
          {renderTitle(skill.name)}
          <p className="ex-ai-skill-byline">
            By {skill.author} · Updated {skill.updated}
          </p>
        </div>
        <Menu>
          <MenuTrigger variant="plain" tone="neutral" size="sm" shape="circle" indicator={false} aria-label="Skill options">
            <EllipsisIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuContent align="end">
            <MenuItem value="download">
              <MenuItemIcon>
                <DownloadIcon />
              </MenuItemIcon>
              Download
            </MenuItem>
            <MenuItem value="duplicate">
              <MenuItemIcon>
                <CopyIcon />
              </MenuItemIcon>
              Duplicate
            </MenuItem>
            <MenuSeparator />
            <MenuItem value="remove">
              <MenuItemIcon>
                <Trash2Icon />
              </MenuItemIcon>
              Remove Skill
            </MenuItem>
          </MenuContent>
        </Menu>
        <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="Close" onClick={onClose}>
          <XIcon aria-hidden="true" />
        </Button>
      </div>
      <div className="ex-ai-skill-body">
        <Outline
          aria-label="Files"
          value={path}
          onValueChange={(value) => {
            if (typeof value === "string" && value.includes(".")) setPath(value)
          }}
          defaultExpanded={["references"]}
          className="ex-ai-skill-tree"
        >
          <OutlineItem value="SKILL.md" label="SKILL.md">
            <OutlineItemLabel>
              <OutlineItemIcon>
                <FileTextIcon aria-hidden="true" />
              </OutlineItemIcon>
              <OutlineItemText>SKILL.md</OutlineItemText>
            </OutlineItemLabel>
          </OutlineItem>
          {skillFolders.map((folder) => (
            <OutlineItem key={folder.path} value={folder.path} label={folder.name}>
              <OutlineItemLabel>
                <OutlineItemIcon>
                  <FolderIcon aria-hidden="true" />
                </OutlineItemIcon>
                <OutlineItemText>{folder.name}</OutlineItemText>
              </OutlineItemLabel>
              <OutlineGroup>
                {folder.files.map((file) => (
                  <OutlineItem key={file.path} value={file.path} label={file.name}>
                    <OutlineItemLabel>
                      <OutlineItemIcon>
                        <FileIcon aria-hidden="true" />
                      </OutlineItemIcon>
                      <OutlineItemText>{file.name}</OutlineItemText>
                    </OutlineItemLabel>
                  </OutlineItem>
                ))}
              </OutlineGroup>
            </OutlineItem>
          ))}
        </Outline>
        <div className="ex-ai-skill-file" role="region" aria-label={path} tabIndex={-1}>
          <SkillFileView skill={skill} path={path} />
        </div>
      </div>
      <div className="ex-ai-skill-footer">
        <Button variant="bezeled" tone="neutral">
          Edit
        </Button>
        <Button variant="filled" onClick={onTry}>
          Try in Chat
        </Button>
      </div>
    </div>
  )
}

export { SkillDetail, SkillsList }
