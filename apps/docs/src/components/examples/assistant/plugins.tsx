"use client"

import { Badge } from "macbetter/badge"
import { Button } from "macbetter/button"
import {
  ContentUnavailable,
  ContentUnavailableActions,
  ContentUnavailableDescription,
  ContentUnavailableIcon,
  ContentUnavailableTitle,
} from "macbetter/content-unavailable"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "macbetter/menu"
import { SearchField } from "macbetter/search-field"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { EllipsisIcon, FileCodeIcon, LinkIcon, PlusIcon, SearchIcon, SettingsIcon, Trash2Icon, UploadIcon } from "lucide-react"
import * as React from "react"
import { plugins, pluginSections, type Plugin } from "./data"
import { AppTile } from "./icons"
import { togglePlugin, useAssistant } from "./store"

function PluginAction({ plugin, installed }: { plugin: Plugin; installed: boolean }) {
  if (!installed) {
    return (
      <Button variant="bezeled" tone="neutral" size="sm" shape="circle" aria-label={`Add ${plugin.name}`} onClick={() => togglePlugin(plugin.id)}>
        <PlusIcon aria-hidden="true" />
      </Button>
    )
  }
  return (
    <Menu
      onAction={(value) => {
        if (value === "remove") togglePlugin(plugin.id)
      }}
    >
      <MenuTrigger variant="plain" tone="neutral" size="sm" shape="circle" indicator={false} aria-label={`${plugin.name} options`}>
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem value="settings">
          <MenuItemIcon>
            <SettingsIcon />
          </MenuItemIcon>
          {plugin.name} Settings…
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="remove">
          <MenuItemIcon>
            <Trash2Icon />
          </MenuItemIcon>
          Remove
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function PluginRow({ plugin, installed }: { plugin: Plugin; installed: boolean }) {
  return (
    <li className="ex-ai-row" data-installed={installed ? "" : undefined}>
      <AppTile glyph={plugin.glyph} color={plugin.color} />
      <span className="ex-ai-row-text">
        <span className="ex-ai-row-name">
          {plugin.name}
          {plugin.badge ? (
            <Badge size="sm" color={plugin.badge === "Beta" ? "orange" : "accent"} className="ex-ai-row-badge">
              {plugin.badge}
            </Badge>
          ) : null}
          {installed ? <span className="mb-visually-hidden">, installed</span> : null}
        </span>
        <span className="ex-ai-row-description">{plugin.description}</span>
      </span>
      <PluginAction plugin={plugin} installed={installed} />
    </li>
  )
}

function AddMenu() {
  return (
    <Menu>
      <MenuTrigger variant="bezeled" tone="neutral" size="sm">
        <PlusIcon aria-hidden="true" />
        Add
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem value="url">
          <MenuItemIcon>
            <LinkIcon />
          </MenuItemIcon>
          Add from URL…
        </MenuItem>
        <MenuItem value="upload">
          <MenuItemIcon>
            <UploadIcon />
          </MenuItemIcon>
          Upload Plugin…
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="build">
          <MenuItemIcon>
            <FileCodeIcon />
          </MenuItemIcon>
          Build Your Own…
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

/** The plugin directory: search, scope, then sections of rows in two columns (one on iPhone). */
function PluginsDirectory({ title = true }: { title?: boolean }) {
  const { installed } = useAssistant()
  const [query, setQuery] = React.useState("")
  const [scope, setScope] = React.useState<"public" | "workspace">("public")
  const headingId = React.useId()
  const needle = query.trim().toLowerCase()
  const matches = plugins.filter(
    (plugin) =>
      plugin.scope === scope &&
      (!needle || plugin.name.toLowerCase().includes(needle) || plugin.description.toLowerCase().includes(needle))
  )

  return (
    <div className="ex-ai-directory">
      <header className="ex-ai-directory-header">
        {title ? (
          <div className="ex-ai-directory-heading">
            <h1 id={headingId} className="ex-ai-directory-title">
              Plugins
            </h1>
            <p className="ex-ai-directory-description">Connect Assistant to the apps and data you work with.</p>
          </div>
        ) : null}
        <div className="ex-ai-directory-controls">
          <SearchField
            aria-label="Search plugins"
            placeholder="Search plugins"
            value={query}
            onValueChange={(value) => setQuery(value)}
            groupClassName="ex-ai-directory-search"
          />
          <AddMenu />
        </div>
        <SegmentedControl
          aria-label="Plugins from"
          value={scope}
          onValueChange={(value) => value && setScope(value as "public" | "workspace")}
          className="ex-ai-directory-scope"
        >
          <SegmentedControlItem value="public">Public</SegmentedControlItem>
          <SegmentedControlItem value="workspace">Workspace</SegmentedControlItem>
        </SegmentedControl>
      </header>
      {matches.length === 0 ? (
        <ContentUnavailable size="md" className="ex-ai-empty">
          <ContentUnavailableIcon>
            <SearchIcon />
          </ContentUnavailableIcon>
          <ContentUnavailableTitle>No results for “{query.trim()}”</ContentUnavailableTitle>
          <ContentUnavailableDescription>Check the spelling, or try searching the other scope.</ContentUnavailableDescription>
          <ContentUnavailableActions>
            <Button variant="bezeled" tone="neutral" onClick={() => setQuery("")}>
              Clear Search
            </Button>
          </ContentUnavailableActions>
        </ContentUnavailable>
      ) : (
        pluginSections.map((section) => {
          const rows = matches.filter((plugin) => plugin.section === section.id)
          if (!rows.length) return null
          return (
            <section key={section.id} className="ex-ai-section" aria-label={section.title}>
              <h2 className="ex-ai-section-title">{section.title}</h2>
              <ul className="ex-ai-grid">
                {rows.map((plugin) => (
                  <PluginRow key={plugin.id} plugin={plugin} installed={installed.includes(plugin.id)} />
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}

export { PluginsDirectory }
