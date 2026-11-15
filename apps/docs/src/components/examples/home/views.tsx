"use client"

import {
  AccessoryGrid,
  AccessoryTile,
  AccessoryTileDetail,
  AccessoryTileIcon,
  AccessoryTileName,
  AccessoryTileRoom,
  AccessoryTileStatus,
  AccessoryTileToggle,
} from "macbetter/accessory-tile"
import { CameraScene, CameraTile } from "macbetter/camera-view"
import { EnergyReadout } from "macbetter/energy-readout"
import { HomeSection, HomeSectionHeader, HomeSectionSummary, HomeSectionTitle } from "macbetter/home-section"
import { HomeStatus, HomeStatusItem } from "macbetter/home-status"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "macbetter/popover"
import { SceneRow, SceneTile } from "macbetter/scene-tile"
import * as React from "react"
import { AccessoryControls, ControlsHeader } from "./controls"
import { forecast, scenes, type Accessory, type RoomId } from "./data"
import { AccessoryGlyph, CategoryGlyph, SceneGlyph, tintOf } from "./icons"
import {
  categories,
  inCategory,
  isOn,
  roomName,
  roomSummary,
  rooms,
  runScene,
  sceneActive,
  statusOf,
  toggle,
  useHome,
  type CategoryId,
} from "./store"

/** How a tile's name opens the controls: a sheet on iPhone, a popover on the Mac. */
type Opener = { kind: "sheet"; open: (id: string) => void } | { kind: "popover" }

const OpenerContext = React.createContext<Opener>({ kind: "popover" })

/** Tiles that toggle from their icon. Sensors, cameras and thermostats only open their controls. */
function toggles(a: Accessory) {
  return !["sensor", "camera", "thermostat"].includes(a.kind)
}

function toggleLabel(a: Accessory) {
  if (a.kind === "lock") return a.state === "secured" ? `Unlock ${a.name}` : `Lock ${a.name}`
  if (a.kind === "door") return a.state === "closed" ? `Open ${a.name}` : `Close ${a.name}`
  return a.name
}

function Tile({ accessory, showRoom, large }: { accessory: Accessory; showRoom?: boolean; large?: boolean }) {
  const opener = React.useContext(OpenerContext)
  const unreachable = accessory.reachable === false
  const transitioning =
    (accessory.kind === "lock" && accessory.target !== accessory.state) ||
    (accessory.kind === "door" && (accessory.state === "opening" || accessory.state === "closing"))
  const alert = accessory.kind === "sensor" && accessory.detected && (accessory.sensor === "leak" || accessory.sensor === "smoke")
  const state = unreachable ? "unreachable" : alert ? "alert" : transitioning ? "updating" : undefined
  const on = isOn(accessory)
  // Locks and garage doors ask before they open, so their icon opens the controls instead of toggling.
  const sensitive = accessory.kind === "lock" ? accessory.state === "secured" : accessory.kind === "door" ? accessory.state === "closed" : false

  const detail = (
    <AccessoryTileDetail
      onClick={opener.kind === "sheet" ? () => opener.open(accessory.id) : undefined}
      aria-label={`${accessory.name}, ${statusOf(accessory)}. Show controls`}
    >
      <AccessoryTileName>{accessory.name}</AccessoryTileName>
      {showRoom ? <AccessoryTileRoom>{roomName(accessory.room)}</AccessoryTileRoom> : null}
      <AccessoryTileStatus>{statusOf(accessory)}</AccessoryTileStatus>
    </AccessoryTileDetail>
  )

  return (
    <AccessoryTile
      tint={tintOf(accessory)}
      size={large ? "lg" : "md"}
      state={state}
      active={!toggles(accessory) || sensitive ? on : undefined}
    >
      {toggles(accessory) && !sensitive ? (
        <AccessoryTileToggle
          aria-label={toggleLabel(accessory)}
          pressed={on}
          disabled={unreachable}
          onPressedChange={() => toggle(accessory.id)}
        >
          <AccessoryGlyph accessory={accessory} />
        </AccessoryTileToggle>
      ) : (
        <AccessoryTileIcon>
          <AccessoryGlyph accessory={accessory} />
        </AccessoryTileIcon>
      )}
      {opener.kind === "popover" ? (
        <Popover>
          <PopoverTrigger render={detail} />
          <PopoverContent className="ex-home-popover" side="bottom">
            <PopoverTitle className="mb-visually-hidden">{accessory.name}</PopoverTitle>
            <ControlsHeader id={accessory.id} />
            <AccessoryControls id={accessory.id} compact />
          </PopoverContent>
        </Popover>
      ) : (
        detail
      )}
    </AccessoryTile>
  )
}

function Tiles({ items, showRoom }: { items: Accessory[]; showRoom?: boolean }) {
  return (
    <AccessoryGrid>
      {items.map((accessory) => (
        <Tile key={accessory.id} accessory={accessory} showRoom={showRoom} />
      ))}
    </AccessoryGrid>
  )
}

function StatusButtons({ value, onValueChange }: { value: CategoryId | null; onValueChange: (id: CategoryId | null) => void }) {
  const { accessories } = useHome()
  return (
    <HomeStatus
      aria-label="Categories"
      value={value ? [value] : []}
      onValueChange={(next: string[]) => onValueChange((next[0] as CategoryId | undefined) ?? null)}
    >
      {/* A category that needs attention, like a leak, moves to the front so it's never scrolled out of view. */}
      {[...categories(accessories)].sort((a, b) => Number(b.alert) - Number(a.alert)).map((c) => (
        <HomeStatusItem
          key={c.id}
          value={c.id}
          icon={<CategoryGlyph id={c.id} />}
          label={c.label}
          summary={c.summary}
          tint={c.alert ? "red" : c.tint}
          alert={c.alert}
        />
      ))}
    </HomeStatus>
  )
}

function Cameras() {
  const { accessories } = useHome()
  const opener = React.useContext(OpenerContext)
  const cameras = accessories.filter((a) => a.kind === "camera").slice(0, 4)
  return (
    <HomeSection>
      <HomeSectionHeader>
        <HomeSectionTitle>Cameras</HomeSectionTitle>
      </HomeSectionHeader>
      <div className="ex-home-cameras">
        {cameras.map((camera) =>
          camera.kind === "camera" ? (
            opener.kind === "sheet" ? (
              <CameraTile
                key={camera.id}
                name={camera.name}
                room={roomName(camera.room)}
                live={camera.online}
                state={camera.online ? "streaming" : "offline"}
                timestamp="9:41 AM"
                onClick={() => opener.open(camera.id)}
              >
                <CameraScene variant={camera.scene} />
              </CameraTile>
            ) : (
              <Popover key={camera.id}>
                <PopoverTrigger
                  render={
                    <CameraTile
                      name={camera.name}
                      room={roomName(camera.room)}
                      live={camera.online}
                      state={camera.online ? "streaming" : "offline"}
                      timestamp="9:41 AM"
                    >
                      <CameraScene variant={camera.scene} />
                    </CameraTile>
                  }
                />
                <PopoverContent className="ex-home-popover ex-home-popover-camera" side="bottom">
                  <PopoverTitle className="mb-visually-hidden">{camera.name}</PopoverTitle>
                  <AccessoryControls id={camera.id} compact />
                </PopoverContent>
              </Popover>
            )
          ) : null
        )}
      </div>
    </HomeSection>
  )
}

function Scenes({ only }: { only?: string[] }) {
  const { accessories, running } = useHome()
  const shown = scenes.filter((s) => !only || only.includes(s.id))
  return (
    <HomeSection>
      <HomeSectionHeader>
        <HomeSectionTitle>Scenes</HomeSectionTitle>
      </HomeSectionHeader>
      <SceneRow aria-label="Scenes">
        {shown.map((scene) => (
          <SceneTile
            key={scene.id}
            icon={<SceneGlyph scene={scene} />}
            name={scene.name}
            active={sceneActive(scene.id, accessories)}
            running={running === scene.id}
            onClick={() => runScene(scene.id)}
          />
        ))}
      </SceneRow>
    </HomeSection>
  )
}

/** The Home tab: categories, cameras, scenes, favorites and rooms. A category narrows it to that kind of accessory. */
function HomeOverview({ onRoom }: { onRoom: (id: RoomId) => void }) {
  const { accessories } = useHome()
  const [category, setCategory] = React.useState<CategoryId | null>(null)
  const favorites = accessories.filter((a) => a.favorite && a.kind !== "camera")

  return (
    <div className="ex-home-overview">
      <StatusButtons value={category} onValueChange={setCategory} />
      {category === "energy" ? (
        <HomeSection>
          <EnergyReadout
            forecast={forecast}
            now={2}
            summary="Cleaner energy 4–10 PM"
            usage={{ value: "18.4 kWh", label: "Used today" }}
          />
        </HomeSection>
      ) : null}
      {category ? (
        rooms
          .map((room) => ({ room, items: accessories.filter((a) => a.room === room.id && inCategory(a, category)) }))
          .filter((group) => group.items.length)
          .map(({ room, items }) => (
            <HomeSection key={room.id}>
              <HomeSectionHeader>
                <HomeSectionTitle onClick={() => onRoom(room.id)}>{room.name}</HomeSectionTitle>
              </HomeSectionHeader>
              <Tiles items={items} />
            </HomeSection>
          ))
      ) : (
        <>
          <Cameras />
          <Scenes />
          <HomeSection>
            <HomeSectionHeader>
              <HomeSectionTitle>Favorites</HomeSectionTitle>
            </HomeSectionHeader>
            <Tiles items={favorites} showRoom />
          </HomeSection>
          {rooms.map((room) => {
            const items = accessories.filter((a) => a.room === room.id && a.kind !== "camera")
            if (!items.length) return null
            return (
              <HomeSection key={room.id}>
                <HomeSectionHeader>
                  <HomeSectionTitle onClick={() => onRoom(room.id)}>{room.name}</HomeSectionTitle>
                  <HomeSectionSummary>{roomSummary(room.id, accessories)}</HomeSectionSummary>
                </HomeSectionHeader>
                <Tiles items={items} />
              </HomeSection>
            )
          })}
        </>
      )}
    </div>
  )
}

/** One room: its summary, its scenes, then its accessories by kind, as the Home app's room view lists them. */
function RoomView({ room }: { room: RoomId }) {
  const { accessories } = useHome()
  const here = accessories.filter((a) => a.room === room)
  const groups: { title: string; items: Accessory[] }[] = [
    { title: "Lights", items: here.filter((a) => a.kind === "light") },
    { title: "Climate", items: here.filter((a) => a.kind === "thermostat" || a.kind === "fan" || a.kind === "shade") },
    { title: "Water", items: here.filter((a) => a.kind === "faucet") },
    { title: "Security", items: here.filter((a) => a.kind === "lock" || a.kind === "door" || a.kind === "camera") },
    { title: "Speakers & TVs", items: here.filter((a) => a.kind === "speaker" || a.kind === "tv") },
    { title: "Power", items: here.filter((a) => a.kind === "outlet") },
    { title: "Sensors", items: here.filter((a) => a.kind === "sensor") },
  ].filter((g) => g.items.length)

  return (
    <div className="ex-home-overview">
      <p className="ex-home-room-summary">{roomSummary(room, accessories) || `${here.length} accessories`}</p>
      {room === "kitchen" ? <Scenes only={["morning", "cooking", "dinner"]} /> : null}
      {groups.map((group) => (
        <HomeSection key={group.title}>
          <HomeSectionHeader>
            <HomeSectionTitle>{group.title}</HomeSectionTitle>
          </HomeSectionHeader>
          <Tiles items={group.items} />
        </HomeSection>
      ))}
    </div>
  )
}

export { HomeOverview, OpenerContext, RoomView, Tile }
export type { Opener }
