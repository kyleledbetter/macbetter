"use client"

import { Artwork } from "@dreambase/stardust/artwork"
import { Button } from "@dreambase/stardust/button"
import { List, ListRow, ListRowAccessory, ListRowTitle, ListSection } from "@dreambase/stardust/list"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "@dreambase/stardust/menu"
import { NavigationBar, NavigationBarTrailing, NavigationStack } from "@dreambase/stardust/navigation-bar"
import { Sidebar, SidebarItem, SidebarSection } from "@dreambase/stardust/sidebar"
import { Slider } from "@dreambase/stardust/slider"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "@dreambase/stardust/tab-bar"
import { toast } from "@dreambase/stardust/toast"
import { Toolbar, ToolbarSearchField, ToolbarSpacer, ToolbarTitle, ToolbarToggle } from "@dreambase/stardust/toolbar"
import { Window, WindowBody, WindowSidebar, WindowTitlebar, WindowTrafficLights } from "@dreambase/stardust/window"
import {
  AirplayIcon,
  ClockIcon,
  DiscIcon,
  DownloadIcon,
  EllipsisIcon,
  FastForwardIcon,
  HeartIcon,
  HouseIcon,
  LayoutGridIcon,
  ListMusicIcon,
  ListOrderedIcon,
  ListPlusIcon,
  MessageSquareQuoteIcon,
  MicVocalIcon,
  MusicIcon,
  PauseIcon,
  PlayIcon,
  RadioIcon,
  RepeatIcon,
  RewindIcon,
  SearchIcon,
  ShareIcon,
  ShuffleIcon,
  SquareLibraryIcon,
  UserRoundIcon,
  Volume1Icon,
  Volume2Icon,
} from "lucide-react"
import * as React from "react"
import { ScreenSheet } from "../screen-sheet"
import { ExampleShell, MacFrame, Phone, useStage } from "../shell"
import { albums, playlists, time, type Album } from "./data"
import "./music.css"

/* ── Playback ──────────────────────────────────────────────────── */

function usePlayer() {
  const [album, setAlbum] = React.useState<Album>(albums[0])
  const [index, setIndex] = React.useState(1)
  const [position, setPosition] = React.useState(74)
  const [playing, setPlaying] = React.useState(false)
  const [volume, setVolume] = React.useState(64)
  const [shuffle, setShuffle] = React.useState(false)
  const [repeat, setRepeat] = React.useState(false)
  const track = album.tracks[index]

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % album.tracks.length)
    setPosition(0)
  }, [album])
  const previous = () => {
    if (position > 3) return setPosition(0)
    setIndex((i) => (i - 1 + album.tracks.length) % album.tracks.length)
    setPosition(0)
  }

  React.useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= track.length) {
          window.setTimeout(next, 0)
          return p
        }
        return p + 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [playing, track.length, next])

  const play = (target: Album, at = 0) => {
    setAlbum(target)
    setIndex(at)
    setPosition(0)
    setPlaying(true)
  }

  return {
    album,
    track,
    index,
    position,
    setPosition,
    playing,
    toggle: () => setPlaying((p) => !p),
    next,
    previous,
    play,
    volume,
    setVolume,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
  }
}

type Player = ReturnType<typeof usePlayer>

function Cover({
  album,
  size,
  radius,
  className,
  animated,
}: {
  album: Album
  size?: number
  radius?: number
  className?: string
  animated?: boolean
}) {
  return (
    <Artwork
      seed={album.id}
      variant={album.art.variant}
      palette={album.art.palette}
      finish={album.art.finish}
      size={size}
      radius={radius}
      animated={animated}
      className={["ex-art", className].filter(Boolean).join(" ")}
    />
  )
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? <PauseIcon aria-hidden="true" fill="currentColor" /> : <PlayIcon aria-hidden="true" fill="currentColor" />
}

/* ── Now playing (iPhone) ──────────────────────────────────────── */

function NowPlaying({ player, onClose }: { player: Player; onClose: () => void }) {
  const { album, track } = player
  return (
    <div
      className="ex-np"
      data-scheme="dark"
      style={{ "--ex-art-from": album.from, "--ex-art-to": album.to } as React.CSSProperties}
    >
      <Button variant="plain" tone="neutral" size="sm" className="ex-np-close" onClick={onClose} aria-label="Close Now Playing">
        <span aria-hidden="true" className="ex-np-chevron" />
      </Button>
      <Cover album={album} className="ex-np-art" radius={14} animated />
      <div className="ex-np-meta">
        <div>
          <div className="ex-np-title">{track.title}</div>
          <div className="ex-np-artist">
            {album.artist} — {album.title}
          </div>
        </div>
        <Menu onAction={(action) => toast(action === "love" ? "Loved" : action === "queue" ? "Added to Up Next" : "Link copied")}>
          <MenuTrigger variant="glass" tone="neutral" shape="circle" size="sm" indicator={false} aria-label="More options">
            <EllipsisIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="love">
              <MenuItemIcon>
                <HeartIcon />
              </MenuItemIcon>
              Love
            </MenuItem>
            <MenuItem value="queue">
              <MenuItemIcon>
                <ListPlusIcon />
              </MenuItemIcon>
              Play Last
            </MenuItem>
            <MenuItem value="share">
              <MenuItemIcon>
                <ShareIcon />
              </MenuItemIcon>
              Share Song…
            </MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <div className="ex-np-scrub">
        <Slider
          size="sm"
          min={0}
          max={track.length}
          value={player.position}
          onValueChange={(v) => player.setPosition(v as number)}
          thumbLabel="Playback position"
          format={(v: number) => `${time(v)} of ${time(track.length)}`}
        />
        <div className="ex-np-times ex-mono">
          <span>{time(player.position)}</span>
          <span>−{time(track.length - player.position)}</span>
        </div>
      </div>
      <div className="ex-np-transport">
        <button type="button" className="ex-np-button" aria-label="Previous" onClick={player.previous}>
          <RewindIcon aria-hidden="true" fill="currentColor" />
        </button>
        <button type="button" className="ex-np-button ex-np-play" aria-label={player.playing ? "Pause" : "Play"} onClick={player.toggle}>
          <PlayGlyph playing={player.playing} />
        </button>
        <button type="button" className="ex-np-button" aria-label="Next" onClick={player.next}>
          <FastForwardIcon aria-hidden="true" fill="currentColor" />
        </button>
      </div>
      <div className="ex-np-volume">
        <Volume1Icon aria-hidden="true" />
        <Slider size="sm" value={player.volume} onValueChange={(v) => player.setVolume(v as number)} thumbLabel="Volume" />
        <Volume2Icon aria-hidden="true" />
      </div>
      <div className="ex-np-extras">
        <button type="button" className="ex-np-button ex-np-small" aria-label="Lyrics">
          <MessageSquareQuoteIcon aria-hidden="true" />
        </button>
        <button type="button" className="ex-np-button ex-np-small" aria-label="AirPlay">
          <AirplayIcon aria-hidden="true" />
        </button>
        <button type="button" className="ex-np-button ex-np-small" aria-label="Up Next">
          <ListOrderedIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ── iPhone ────────────────────────────────────────────────────── */

const libraryRows = [
  { label: "Playlists", icon: ListMusicIcon },
  { label: "Artists", icon: MicVocalIcon },
  { label: "Albums", icon: SquareLibraryIcon },
  { label: "Songs", icon: MusicIcon },
  { label: "Downloaded", icon: DownloadIcon },
]

function PhoneLibrary({ player }: { player: Player }) {
  return (
    <NavigationStack>
      <NavigationBar title="Library" largeTitle>
        <NavigationBarTrailing>
          <Button variant="plain" size="sm">
            Edit
          </Button>
        </NavigationBarTrailing>
      </NavigationBar>
      <List variant="plain" className="ex-music-list">
        <ListSection>
          {libraryRows.map((row) => (
            <ListRow key={row.label} onClick={() => {}}>
              <span className="ex-music-row-glyph" aria-hidden="true">
                <row.icon />
              </span>
              <ListRowTitle>{row.label}</ListRowTitle>
              <ListRowAccessory type="disclosure" />
            </ListRow>
          ))}
        </ListSection>
      </List>
      <h2 className="ex-music-heading">Playlists</h2>
      <div className="ex-album-grid ex-album-grid-phone ex-album-grid-shelf">
        {playlists.map((playlist) => (
          <button key={playlist.name} type="button" className="ex-album" onClick={() => toast(`Playing ${playlist.name}`)}>
            <Artwork seed={playlist.name} variant={playlist.art.variant} palette={playlist.art.palette} radius={10} className="ex-art" />
            <span className="ex-album-title">{playlist.name}</span>
            <span className="ex-album-artist">{playlist.curator}</span>
          </button>
        ))}
      </div>
      <h2 className="ex-music-heading">Recently Added</h2>
      <div className="ex-album-grid ex-album-grid-phone">
        {albums.map((album) => (
          <button key={album.id} type="button" className="ex-album" onClick={() => player.play(album)}>
            <Cover album={album} radius={10} />
            <span className="ex-album-title">{album.title}</span>
            <span className="ex-album-artist">{album.artist}</span>
          </button>
        ))}
      </div>
    </NavigationStack>
  )
}

function MiniPlayer({ player, onOpen }: { player: Player; onOpen: () => void }) {
  return (
    <div className="ex-mini sd-glass" data-shape="capsule">
      <button type="button" className="ex-mini-open" onClick={onOpen} aria-label={`Now Playing: ${player.track.title} by ${player.album.artist}`}>
        <Cover album={player.album} size={36} radius={8} />
        <span className="ex-mini-text">
          <span className="ex-mini-title">{player.track.title}</span>
          <span className="ex-mini-artist">{player.album.artist}</span>
        </span>
      </button>
      <button type="button" className="ex-mini-button" aria-label={player.playing ? "Pause" : "Play"} onClick={player.toggle}>
        <PlayGlyph playing={player.playing} />
      </button>
      <button type="button" className="ex-mini-button" aria-label="Next" onClick={player.next}>
        <FastForwardIcon aria-hidden="true" fill="currentColor" />
      </button>
    </div>
  )
}

const tabs = [
  { value: "home", label: "Home", icon: <HouseIcon /> },
  { value: "new", label: "New", icon: <LayoutGridIcon /> },
  { value: "radio", label: "Radio", icon: <RadioIcon /> },
  { value: "library", label: "Library", icon: <SquareLibraryIcon /> },
  { value: "search", label: "Search", icon: <SearchIcon /> },
]

function PhoneMusic({ player }: { player: Player }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Phone label="Music on iPhone">
      <div className="ex-app-root">
        <TabBar defaultValue="library" className="ex-music-tabs">
          {tabs.map((tab) => (
            <TabBarPanel key={tab.value} value={tab.value}>
              {tab.value === "library" ? (
                <PhoneLibrary player={player} />
              ) : (
                <NavigationStack>
                  <NavigationBar title={tab.label} largeTitle />
                  <div className="ex-album-grid ex-album-grid-phone">
                    {albums.slice(tab.value.length % 3, 8).map((album) => (
                      <button key={album.id} type="button" className="ex-album" onClick={() => player.play(album)}>
                        <Cover album={album} radius={10} />
                        <span className="ex-album-title">{album.title}</span>
                        <span className="ex-album-artist">{album.genre}</span>
                      </button>
                    ))}
                  </div>
                </NavigationStack>
              )}
            </TabBarPanel>
          ))}
          <MiniPlayer player={player} onOpen={() => setOpen(true)} />
          <TabBarList aria-label="Music">
            {tabs.map((tab) => (
              <TabBarItem key={tab.value} value={tab.value} icon={tab.icon}>
                {tab.label}
              </TabBarItem>
            ))}
          </TabBarList>
        </TabBar>
        <ScreenSheet open={open} onOpenChange={setOpen} title="Now Playing" className="ex-np-sheet">
          <NowPlaying player={player} onClose={() => setOpen(false)} />
        </ScreenSheet>
      </div>
    </Phone>
  )
}

/* ── macOS ─────────────────────────────────────────────────────── */

function MacMusic({ player }: { player: Player }) {
  const [place, setPlace] = React.useState("Recently Added")
  const [query, setQuery] = React.useState("")
  const [view, setView] = React.useState(true)
  const shown = albums.filter((a) => `${a.title} ${a.artist} ${a.genre}`.toLowerCase().includes(query.trim().toLowerCase()))
  const { album, track } = player

  return (
    <MacFrame>
      <Window aria-label="Music">
        <WindowSidebar>
          <WindowTrafficLights />
          <Sidebar aria-label="Music">
            <SidebarSection>
              {[
                { name: "Home", icon: HouseIcon },
                { name: "New", icon: LayoutGridIcon },
                { name: "Radio", icon: RadioIcon },
              ].map((item) => (
                <SidebarItem key={item.name} icon={<item.icon />} current={place === item.name} onClick={() => setPlace(item.name)}>
                  {item.name}
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection title="Library" collapsible>
              {[
                { name: "Recently Added", icon: ClockIcon },
                { name: "Artists", icon: UserRoundIcon },
                { name: "Albums", icon: DiscIcon },
                { name: "Songs", icon: MusicIcon },
              ].map((item) => (
                <SidebarItem key={item.name} icon={<item.icon />} current={place === item.name} onClick={() => setPlace(item.name)}>
                  {item.name}
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection title="Playlists" collapsible>
              {playlists.map((playlist) => (
                <SidebarItem
                  key={playlist.name}
                  icon={<Artwork seed={playlist.name} variant={playlist.art.variant} palette={playlist.art.palette} finish="flat" size={18} radius={4} />}
                  current={place === playlist.name}
                  onClick={() => setPlace(playlist.name)}
                >
                  {playlist.name}
                </SidebarItem>
              ))}
            </SidebarSection>
          </Sidebar>
        </WindowSidebar>
        <WindowTitlebar>
          <Toolbar aria-label="Music">
            <ToolbarTitle subtitle={`${shown.length} albums`}>{place}</ToolbarTitle>
            <ToolbarSpacer />
            <ToolbarToggle aria-label="Show album titles" pressed={view} onPressedChange={setView}>
              <SquareLibraryIcon aria-hidden="true" />
            </ToolbarToggle>
            <ToolbarSearchField aria-label="Search your library" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
          </Toolbar>
        </WindowTitlebar>
        <WindowBody className="ex-music-body">
          <div className="ex-scroll ex-music-scroll">
            {shown.length ? (
              <div className="ex-album-grid" data-titles={view ? "" : undefined}>
                {shown.map((item) => {
                  const current = item.id === album.id
                  return (
                    <div key={item.id} className="ex-album" data-current={current ? "" : undefined}>
                      <span className="ex-album-art-wrap">
                        <Cover album={item} radius={8} />
                        <button
                          type="button"
                          className="ex-album-play"
                          aria-label={current && player.playing ? `Pause ${item.title}` : `Play ${item.title} by ${item.artist}`}
                          onClick={() => (current ? player.toggle() : player.play(item))}
                        >
                          <PlayGlyph playing={current && player.playing} />
                        </button>
                      </span>
                      <span className="ex-album-title">{item.title}</span>
                      <span className="ex-album-artist">{item.artist}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="ex-empty">
                <strong>No results</strong>
                <span>Nothing in your library matches “{query}”.</span>
              </div>
            )}
          </div>
          <div className="ex-transport sd-glass" role="region" aria-label="Playback">
            <div className="ex-transport-controls">
              <button type="button" className="ex-t-button" aria-label="Shuffle" aria-pressed={player.shuffle} onClick={() => player.setShuffle(!player.shuffle)}>
                <ShuffleIcon aria-hidden="true" />
              </button>
              <button type="button" className="ex-t-button" aria-label="Previous" onClick={player.previous}>
                <RewindIcon aria-hidden="true" fill="currentColor" />
              </button>
              <button type="button" className="ex-t-button ex-t-play" aria-label={player.playing ? "Pause" : "Play"} onClick={player.toggle}>
                <PlayGlyph playing={player.playing} />
              </button>
              <button type="button" className="ex-t-button" aria-label="Next" onClick={player.next}>
                <FastForwardIcon aria-hidden="true" fill="currentColor" />
              </button>
              <button type="button" className="ex-t-button" aria-label="Repeat" aria-pressed={player.repeat} onClick={() => player.setRepeat(!player.repeat)}>
                <RepeatIcon aria-hidden="true" />
              </button>
            </div>
            <div className="ex-transport-now">
              <Cover album={album} size={40} radius={6} />
              <div className="ex-transport-info">
                <div className="ex-transport-line">
                  <span className="ex-transport-title">{track.title}</span>
                  <span className="ex-transport-artist">
                    {album.artist} — {album.title}
                  </span>
                </div>
                <div className="ex-transport-scrub">
                  <span className="ex-mono">{time(player.position)}</span>
                  <Slider
                    size="sm"
                    min={0}
                    max={track.length}
                    value={player.position}
                    onValueChange={(v) => player.setPosition(v as number)}
                    thumbLabel="Playback position"
                    format={(v: number) => `${time(v)} of ${time(track.length)}`}
                  />
                  <span className="ex-mono">−{time(track.length - player.position)}</span>
                </div>
              </div>
            </div>
            <div className="ex-transport-volume">
              <Volume1Icon aria-hidden="true" />
              <Slider size="sm" value={player.volume} onValueChange={(v) => player.setVolume(v as number)} thumbLabel="Volume" />
              <Volume2Icon aria-hidden="true" />
              <button type="button" className="ex-t-button" aria-label="AirPlay">
                <AirplayIcon aria-hidden="true" />
              </button>
              <button type="button" className="ex-t-button" aria-label="Up Next">
                <ListOrderedIcon aria-hidden="true" />
              </button>
            </div>
          </div>
        </WindowBody>
      </Window>
    </MacFrame>
  )
}

function MusicApp() {
  const player = usePlayer()
  const { platform } = useStage()
  return platform === "ios" ? <PhoneMusic player={player} /> : <MacMusic player={player} />
}

function MusicExample() {
  return (
    <ExampleShell title="Music" platforms={["macos", "ios"]}>
      <MusicApp />
    </ExampleShell>
  )
}

export { MusicApp, MusicExample }
