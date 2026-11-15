# HomeKit research for the macbetter home components

Research date: 2026-11-15. Everything below comes from Apple's own pages, read as DocC JSON (developer.apple.com/tutorials/data/…) or as server-rendered HTML (support.apple.com, apple.com, developer.apple.com/apple-home). Statements marked **(inferred)** are my reading, not something Apple wrote. Section 6 lists what I could not reach.

macbetter is a set of web UI components. It does not talk to HomeKit, Matter or any accessory, and it is not endorsed by Apple.

## 1. Human Interface Guidelines

### HomeKit — https://developer.apple.com/design/human-interface-guidelines/homekit (JSON: …/human-interface-guidelines/homekit.json, last change May 2, 2023)

Terminology and object model:

- The **home** is the root of a hierarchy that contains rooms, accessories and zones. One person can have more than one home. "Recognize that people can have more than one home" and show the home in an accessory detail view.
- A **room** is just a name that means something to people ("Bedroom", "Office"); it has no size or location.
- A **zone** is an area with several rooms ("upstairs", "downstairs"). Optional.
- An **accessory** is the physical device (ceiling fan, lamp, lock, camera). Its **category** is its type (thermostat, fan, light). A switch wired to a lamp should take the category of the thing it controls.
- A **service** is a controllable feature of an accessory (the light on a garage door opener). "Apps don't use the word service in the UI"; use a name that describes it ("garage door opener", "ceiling fan light"). Siri uses the service name, not the accessory name.
- A **characteristic** is a controllable attribute of a service (speed, brightness). "Apps don't use the word characteristic in the UI."
- A **service group** is a set of services controlled as one ("reading lamps").
- An **action** changes a characteristic. A **scene** is a group of actions. "The HomeKit API uses the term action set instead of scene. In your app's UI, always use the term scene."
- An **automation** makes accessories react to a time, a location change, another accessory, or a sensor.
- Use the HomeKit model and vocabulary; don't hide an accessory's room or zone in a settings screen; don't present duplicate home settings — defer to the Home app.

Setup:

- Use the system-provided setup flow (it names accessories, joins networks, pairs, assigns room and category, and sets favorites "in just a few steps"). Developer API: `HMAccessorySetupManager.performAccessorySetup(using:)`.
- Explain why you need Home data access with a purpose string, e.g. "Lets you control this accessory with the Apple Home app and Siri across your Apple devices."
- Don't require an account or personal information; offer optional accounts only after setup. Don't force other platforms' setup. Offer a custom post-setup experience after basic functionality works.

Naming rules for services (the do/don't marks in the table are images; which row is which is **inferred** from the surrounding text):

- Only alphanumeric, space and apostrophe characters.
- Start and end with a letter or number.
- No emoji.
- Good: "Reading lamp", "2nd garage door". Bad: "📚 lamp", "#2 garage door".
- Don't put location in the name ("kitchen light"): assign the room instead. Never suggest company names or model numbers.

Siri: show example phrases using the chosen service name after setup ("Hey Siri, set 'Movie Time.'"). Offer shortcuts only for functionality HomeKit doesn't already support.

Custom functionality: defer to the HomeKit database; ask permission before writing to it; present conflicts side by side.

Cameras:

- "Don't block camera images." Supplementary alerts are fine; avoid covering portions of the image.
- "Show a microphone button only if the camera supports bidirectional audio."

Icons and branding:

- Use only Apple-provided HomeKit and Apple Home app icons, downloaded from Resources. "Don't create your own HomeKit or Home app icon design or attempt to mimic the Apple-provided designs."
- Use the HomeKit icon noninteractively, never inside text, never in custom buttons.
- Referring to HomeKit: emphasize your app over HomeKit; HomeKit is one word with capital H and K; "Apple Home" on first mention, then "the Home app"; don't use HomeKit as a descriptor ("HomeKit lightbulbs" is wrong, "works with HomeKit" is right); don't say HomeKit performs an action ("HomeKit unlocked the back door" is wrong); don't imply sponsorship or endorsement.

### Controls — https://developer.apple.com/design/human-interface-guidelines/controls (iOS 18+, Control Center, Lock Screen, Action button)

- A control is a button or toggle with a symbol, a title and optionally a value (title = light name, value = on/off).
- For toggles, provide a symbol for both states (e.g. `door.garage.open` / `door.garage.closed`) and animate between them; animate while an action with duration runs.
- Update the control to show if an action is still in progress.
- The system tints the symbol of a toggle in its on state with the app's tint color.
- Hide sensitive information when locked. "Require authentication for actions that affect security", for example "to lock or unlock the door to their house".

### Widgets — https://developer.apple.com/design/human-interface-guidelines/widgets (updated 2026-10-13: "Added guidance for Apple HomeView")

- System small/medium/large/extra large; accessory circular/inline/rectangular on the Lock Screen. Apple HomeView (a new device) shows system small widgets on its Home Screen and Modular face.
- Full-color, accented (tinted) and vibrant rendering modes. Clear appearance uses Liquid Glass.
- Widgets can contain buttons and toggles (Reminders example); avoid app-like layouts; make targets easy to hit.
- Widgets don't update continuously; show when data was last updated if people check more often than you can refresh. Animations up to two seconds.

### Live Activities — https://developer.apple.com/design/human-interface-guidelines/live-activities

- Presentations: compact, minimal, expanded, Lock Screen; StandBy scales Lock Screen 2x.
- For tasks with a defined beginning and end, up to eight hours. Avoid sensitive information. Limit interactivity, ideally one element. End immediately when the task ends.
- **(inferred)** For a home app this fits things like a garage door opening, a robot vacuum run, or EV charging, not a light's on state.

### Notifications — https://developer.apple.com/design/human-interface-guidelines/notifications

- Don't rely on a short look alone for critical information. Time Sensitive notifications are a separate interruption level (linked from the page).

### Sliders — https://developer.apple.com/design/human-interface-guidelines/sliders

- Minimum at leading, maximum at trailing; for vertical sliders minimum at the bottom, maximum at the top.
- In iOS/iPadOS, "Don't use a slider to adjust audio volume" in your own app — use the system volume view. **(inferred)** Speaker volume for a HomePod in a Home-style control sheet is a characteristic (`HMCharacteristicTypeVolume`), not device audio, so a level control is appropriate there; the docs should say so.

### Toggles — https://developer.apple.com/design/human-interface-guidelines/toggles

Read for state guidance; nothing home-specific.

### Siri, App Shortcuts — https://developer.apple.com/design/human-interface-guidelines/siri, …/app-shortcuts

Read; relevant only as "show example phrases" and "don't duplicate HomeKit with shortcuts" (above).

### Not found in the HIG

- No HIG page for Matter, AccessorySetupKit or EnergyKit (`…/matter.json`, `…/accessory-setup-kit.json`, `…/energy.json` return 404).
- The HIG gives no numbers for Home tiles, sliders or thermostat dials.

## 2. Frameworks

### HomeKit — https://developer.apple.com/documentation/homekit

"Configure, control, and communicate with home automation accessories."

| Class | What the docs say | UI it implies |
|---|---|---|
| `HMHomeManager` / `HMHome` | Homes with `name`, `isPrimary`, `rooms`, `roomForEntireHome()`, `zones`, `accessories`, `serviceGroups`, `actionSets`, `triggers`, `homeHubState` (connected, disconnected, notAvailable) | Home picker; rooms list; "Default Room"; hub status |
| `HMRoom` | `name`, `accessories` | Room sections and room screens |
| `HMZone` | `name`, `rooms` | Optional grouping of rooms |
| `HMAccessory` | `name`, `category`, `room`, `services`, `isReachable`, `isBlocked`, `isBridged`, `firmwareVersion`, `manufacturer`, `model`, `cameraProfiles`, `identify()` | Tile; "No Response" state **(inferred label)**; detail/settings view |
| `HMService` | `name`, `serviceType`, `isPrimaryService`, `isUserInteractive`, `characteristics`, `linkedServices`, `matterEndpointID` | One tile per service or per accessory; multi-service accessories show features inside one tile (Mac guide) |
| `HMCharacteristic` | `characteristicType`, `value`, `readValue`, `writeValue`, `metadata`, `enableNotification` | Controls |
| `HMCharacteristicMetadata` | `minimumValue`, `maximumValue`, `stepValue`, `validValues`, `units`, `format` | Ranges and steps for sliders and dials |
| `HMActionSet` | `name`, `actions`, `actionSetType` (built-in HomeArrival, HomeDeparture, Sleep, WakeUp; user-defined; trigger-owned), `isExecuting`, `lastExecutionDate` | Scene tile with running state |
| `HMTrigger` | `name`, `isEnabled`, `lastFireDate`, `actionSets` | Automation row with on/off |
| `HMEventTrigger` | location, time (incl. significant events sunrise/sunset), characteristic, presence events; `endEvents`; `recurrences`; `executeOnce`; predicates | Automation editor: "When", "People", "Repeat", "Turn off after" |
| `HMTimerTrigger` | `fireDate`, `recurrence` | Time-of-day automation |
| `HMCameraProfile` | optional `streamControl`, `snapshotControl`, `microphoneControl`, `speakerControl`, `settingsControl` ("Each profile control is optional") | Camera view; mic button only when supported |
| `HMCameraStreamControl` / `HMCameraSnapshotControl` | `startStream`, `stopStream`, `streamState`; `takeSnapshot`, `mostRecentSnapshot` | Live vs snapshot display |
| `HMCameraView` / SwiftUI `CameraView` | "The view into which a video stream or an image snapshot is rendered." | Camera frame |
| `HMAccessorySetupManager`, `HMAccessorySetupRequest` | `performAccessorySetup`; request has `homeUniqueIdentifier`, `payload`, `suggestedAccessoryName`, `suggestedRoomUniqueIdentifier`, `matterPayload` | Setup flow: code, name, room |
| `HMAccessorySetupPayload` | "Typically, the URL comes from scanning a QR code on the accessory." Payload format is MFi-only. | Scan area |

Service types (Accessory Service Types page): lightbulb, light sensor, switch, battery, outlet, programmable switches, air purifier, air quality sensor, CO₂ and CO sensors, smoke sensor, heater/cooler, temperature sensor, thermostat, fan, filter maintenance, humidifier/dehumidifier, humidity sensor, ventilation fan, window, window covering, slats, **faucet**, valve, irrigation system, **leak sensor**, door, doorbell, garage door opener, lock management, lock mechanism, motion sensor, occupancy sensor, security system, contact sensor, camera control, RTP stream management, microphone, speaker, input source, television, Wi-Fi router, Wi-Fi satellite, label, accessory information.

Characteristic values the components use (each from its own constant page):

| Characteristic | Value per Apple |
|---|---|
| Brightness | integer percentage of maximum brightness (0–100) |
| Hue | float, arc degrees, 0–360 from red through yellow, green, cyan, blue, magenta |
| Saturation | float percentage of maximum saturation |
| Color temperature | integer in mireds = 1,000,000 / kelvin; "3200 K … about 312" |
| Current / target temperature | float, degrees Celsius |
| Heating threshold / cooling threshold | float, °C; "below which heating will be active" / "above which cooling will be active" (auto range) |
| Target heating cooling | `HMCharacteristicValueHeatingCooling`: off, heat, cool, auto |
| Current heating cooling | `HMCharacteristicValueCurrentHeatingCooling` (idle, heating, cooling) |
| Temperature units | Celsius or Fahrenheit |
| Lock mechanism current state | unsecured, secured, jammed, unknown |
| Current door state | open, closed, opening, closing, stopped |
| Target door state | open, closed |
| Obstruction detected | Boolean ("as when something prevents a garage door from closing") |
| Current / target position | integer percentage; 0 = closed or least light, 100 = opposite |
| Position state | closing, opening, stopped |
| Rotation speed | float percentage of maximum speed |
| Rotation direction, swing mode, current/target fan state | listed |
| Volume | percentage of maximum volume; Mute is separate |
| Air quality | unknown, excellent, good, fair, inferior, poor |
| Battery level | integer percentage; Status low battery: normal, low |
| Contact state | detected, none |
| Motion detected | Boolean |
| Occupancy | occupied, notOccupied |
| Leak detected | none, detected |
| Smoke detected | none, detected |
| Units | percentage, ppm, celsius, fahrenheit, seconds, lux, µg/m³, arc degrees |

Sample-code guidance, "Interacting with a home automation network" → "Adjust the interface for a published app": expose much less detail (no identifiers or firmware up front); "Focus on services as the root interface element, just like in the Home app"; expose only user-interactive services.

### Related kits

- **Matter** (https://developer.apple.com/documentation/matter) and **MatterSupport** (…/mattersupport): Matter is the cross-vendor connectivity standard. MatterSupport adds devices to an ecosystem (`MatterAddDeviceRequest`); Matter commissions and controls them through clusters (On/Off, Level…). UI surfaces: the system add-device sheet, then the same controls as HomeKit. Matter setup codes are 11 or 21 digits (support guide). MatterSupport returns errors in Mac Catalyst apps.
- **HomeKit Secure Video**: not a separate framework. Described in the Home support guide: video analyzed and encrypted on the home hub, iCloud+ recording of the last 10 days, Activity Zones, face recognition, timeline symbols for people, animals, vehicles and packages, an "Unanalyzed Video" badge. UI surfaces: camera view with Live / timeline of clips, motion-type icons.
- **AccessorySetupKit** (…/accessorysetupkit): privacy-preserving discovery and setup of Bluetooth and Wi-Fi accessories with the app's own images and names; iOS and iPadOS. UI surface: a system picker sheet showing the accessory image and name. Not HomeKit pairing.
- **EnergyKit** (…/energykit): grid forecasts (cleaner and cheaper times), electricity insights, and load events from EV chargers and HVAC that the Home app displays. Contiguous US only. UI surfaces: the Home app's Energy category and Grid Forecast widget (green bars mark cleaner times), usage history. Apple says apps get "rich activity logs and analytics in the Home app without building custom statistics or graphing UI".
- **WeatherKit** (…/weatherkit): current conditions, minute precipitation, hourly and daily forecasts, severe weather alerts; requires attribution (`WeatherAttribution`). UI surface: outdoor temperature beside the home summary **(inferred; the Home app support pages don't mention weather)**.
- **WidgetKit** (…/widgetkit): widgets, watch complications, Live Activities and controls. UI surfaces: Home Screen and Lock Screen widgets with toggles, Control Center controls.
- **ActivityKit** (…/activitykit): starts, updates and ends Live Activities (Dynamic Island, Lock Screen).
- **App Intents** (…/appintents): exposes actions to Siri, Spotlight, Shortcuts, widgets, controls and the Action button. SiriKit is now legacy (…/sirikit says to use App Intents for modern support).
- **ThreadNetwork** (…/threadnetwork): manage Thread Border Router credentials. No user-facing component; Thread status shows up only as accessory reachability **(inferred)**.

## 3. How Apple's Home app presents things

Sources: iPhone User Guide (support.apple.com/guide/iphone/…), Home User Guide for Mac (support.apple.com/guide/home/…/mac, current version "macOS 27 Golden Gate"), apple.com/home-app.

Home tab (iPhone, "Intro to Home on iPhone", https://support.apple.com/guide/iphone/intro-to-home-iph22d98bbca/ios):

- Sections from top: **Categories** ("Climate, Lights, Security, Speakers & TVs, or Water"), **Cameras** ("Video from up to four cameras… Swipe left to see more"), **Scenes**, **Favorites**, **Rooms**. The image description: "four categories, two scenes, three camera views, and the status of one room. Across the bottom are the tabs Home (which is selected), Automation, and Discover."
- The More button offers Edit Home View (drag tiles), Reorder Sections, and Resize (tap a tile, tap Resize).

Category buttons ("Control accessories", https://support.apple.com/guide/iphone/control-accessories-iph0a717a8fd/ios):

- "Below your home's name, buttons show the status of accessories belonging to a category—for example, a Lights category that shows '3 on.'" Tapping one shows all accessories in that category, organized by room. Energy is also a category ("Tap the Energy category… to show the Grid Forecast widget").
- Mac lists five categories along the top: Climate, Lights, Security, Speakers & TVs, Energy.

Accessory tile anatomy:

- iPhone: "tap an accessory's icon on the left side of the tile… to quickly turn the accessory on or off. Tap the accessory's name on the right side of the tile to show the accessory's control."
- Mac: "Click an accessory's icon in the tile to turn it on or off. Click the accessory's name in the tile to use the available controls." Control-click a tile to change how it appears. Drag a tile to a room in the sidebar to move it.
- Touch and hold a tile → Accessory Settings (room, name, icon, automations, Include in Favorites, Group with Other Accessories).
- Tiles can be resized; Apple gives no dimensions. **(inferred from the description above)** there is a wide tile with icon and text side by side and a smaller square tile with the icon only.
- Multi-feature accessories (fan with light) are one tile with features chosen inside.

Accessory controls: "The available controls depend on the type of accessory. For example, with some lightbulbs, there are controls for changing colors." Lights can turn on Adaptive Lighting (color temperature follows the day; needs a home hub). Mac: "click the Adaptive Light button in the top-left corner of buttons… To return to one consistent color during the day, click another color button" — so the light control has a row of color buttons. The Options button is bottom-right of the control; Close is top-right. Set-top boxes might show only an Activate button.

Not documented in words: the tall slider, the thermostat dial, lock confirmation or fan speed UI. Those are **(inferred)** from familiarity with the app and must be tuned by eye.

Scenes (https://support.apple.com/guide/iphone/create-and-use-scenes-iphb96e3f655/ios): tap to run; touch and hold → Edit Scene; the first accessory chosen sets the scene's room; "Test This Scene"; "Add to Home View" / show on Home tab. Mac: the first eight scenes appear on the Home screen automatically.

Automations (https://support.apple.com/guide/iphone/use-automations-iph6d50ec543/ios): triggers "People Arrive", "People Leave", "A Time of Day Occurs" (incl. Sunrise/Sunset, "only occur after sunset"), "An Accessory is Controlled", "A Sensor Detects Something". In the Automation tab you can enable/disable, choose when, add or remove accessories, test, delete. Mac adds "you can set how long they stay on before they turn off".

Setup (https://support.apple.com/guide/iphone/set-up-accessories-iph125110541/ios): Home → Add Accessory; "scan a QR code, enter an 8-digit Apple Home setup code found on the accessory itself (or its box or documentation), or enter an 11 or 21-digit code for Matter-enabled accessories." Then assign a room, give it a name, optionally add suggested automations. Removing a room moves its accessories to "Default Room". The Mac can't add accessories ("you must use the Home app on an iPhone or iPad"). The 8-digit code is commonly printed as `XXX-XX-XXX` **(from an Apple Community thread, not Apple documentation)**.

Cameras (https://support.apple.com/guide/iphone/set-up-security-cameras-iph7bc5df9d9/ios and Mac "cameras"): tap the camera tile; live video plays automatically; timeline of clips at the bottom; "Tap Live to switch back to live video"; Picture-in-Picture on Mac; notifications when a camera detects activity, changes status, or goes offline.

Activity History: garage doors, locks, security systems, adaptive temperature thermostats; up to 30 days; reached from Security or Climate category → Home Activity.

Energy (https://support.apple.com/guide/iphone/use-grid-forecast-to-plan-your-energy-usage-iph6f57f4435/ios, …/view-electricity-usage-and-rates-iphb93a7973e/ios): Grid Forecast widget with green bars for cleaner times; utility account shows usage, time-of-use peak/off-peak, solar import/export; data lags 24–72 hours.

Multiple homes (https://support.apple.com/guide/iphone/add-more-homes-iph4fd8a0b89/ios): Add New Home; switch with the More button.

Mac layout: a sidebar with Home, rooms, Automation and Discover ("Click Automation in the sidebar"; "click Discover in the sidebar"); File > Add Automation.

Marketing page (https://www.apple.com/home-app/): "Categories like Lights, Security, and Climate are at the top of the Home tab"; "Rooms and Favorite Accessories are grouped in the Home tab"; Apple HomeView, Apple Home Collection, robot vacuums, Adaptive Temperature, home key.

## 4. Branding and licensed marks

- **Works with Apple Home badge** (https://developer.apple.com/apple-home/works-with-apple-home/): for Matter-certified accessories (and MFi HomeKit accessories) after CSA certification and a request form; use requires agreeing to the "Works with Apple Home Artwork License Agreement". "Don't alter the artwork in any way." Don't place it on the accessory; don't use it for an app on its own; "Don't create graphics, logotypes, or graphic renderings to represent Apple Home."
- **HomeKit icon and Apple Home app icon**: Apple-provided only (HIG).
- Consequence for macbetter: no HomeKit icon, no Apple Home icon, no Works with Apple Home badge, no drawn imitation of any of them. The setup screen shows a generic code and a scan frame.

## 5. Decisions this research supports **(inferred)**

- Component names use Apple's UI vocabulary: Accessory, Scene, Room, Automation, Camera, Sensor, Setup code — not Service, Characteristic or Action set.
- AccessoryTile has two hit areas, as Apple documents: the icon toggles, the name opens the controls.
- Status uses words and icons as well as color ("3 on", "Locked", "No Response", "Leak Detected").
- The lock and garage door components ask for confirmation, reflecting the Controls HIG's "Require authentication for actions that affect security".
- The camera view draws nothing over the image except small corner badges; the microphone button is optional.
- Color temperature is stored and exposed in mireds with kelvin labels; hue 0–360, saturation and brightness 0–100; temperatures in °C with °F display conversion.
- An energy readout is limited to a grid-forecast bar strip and a usage figure, because Apple says the Home app shows EnergyKit analytics itself.

## 6. What I could not reach or confirm

- WebFetch returned only the table of contents for support.apple.com pages; I read them with a plain HTTP fetch and an HTML-to-text pass instead.
- HIG images (including the do/don't marks in the naming table and all screenshots) are not readable as text.
- No Apple source gives dimensions for tiles, sliders, dials or sheets. Apple Design Resources (Sketch/Figma files) were not opened.
- The iPad User Guide's Home pages were not read separately; iPad behavior is assumed to match iPhone with a sidebar, like the Mac. **(inferred)**
- The `HMCharacteristicValueCurrentHeatingCooling` page and fan-state value pages were not read in full (one URL returned 404); idle/heating/cooling is listed as referenced from the current heating cooling page.
- No HIG page exists for Matter, AccessorySetupKit or EnergyKit.
- The "Matter Accessory Best Practices for Apple Home" PDF was not read.
