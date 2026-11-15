type NavItem = { title: string; href: string; badge?: string }
type NavSection = { title: string; items: NavItem[] }

const doc = (slug: string, title: string, badge?: string): NavItem => ({
  title,
  href: `/docs/${slug}`,
  badge,
})

const nav: NavSection[] = [
  {
    title: "Get started",
    items: [
      doc("introduction", "Introduction"),
      doc("installation", "Installation"),
      doc("platforms", "Platforms"),
      doc("theming", "Theming"),
      doc("agents", "Built for agents"),
    ],
  },
  {
    title: "Foundations",
    items: [
      doc("foundations/color", "Color"),
      doc("foundations/typography", "Typography"),
      doc("foundations/web-typography", "Web typography"),
      doc("foundations/materials", "Materials"),
      doc("foundations/motion", "Motion"),
      doc("foundations/layout", "Layout and shape"),
      doc("foundations/accessibility", "Accessibility"),
    ],
  },
  {
    title: "Components",
    items: [doc("components", "Overview")],
  },
  {
    title: "Buttons and controls",
    items: [
      doc("components/button", "Button"),
      doc("components/toggle", "Toggle"),
      doc("components/switch", "Switch"),
      doc("components/checkbox", "Checkbox"),
      doc("components/radio", "Radio"),
      doc("components/segmented-control", "Segmented Control"),
      doc("components/slider", "Slider"),
      doc("components/stepper", "Stepper"),
      doc("components/rating", "Rating"),
      doc("components/color-well", "Color Well"),
    ],
  },
  {
    title: "Text and fields",
    items: [
      doc("components/field", "Field"),
      doc("components/text-field", "Text Field"),
      doc("components/search-field", "Search Field"),
      doc("components/secure-field", "Secure Field"),
      doc("components/text-area", "Text Area"),
      doc("components/code-field", "Code Field"),
      doc("components/token-field", "Token Field"),
      doc("components/date-picker", "Date Picker"),
      doc("components/calendar", "Calendar"),
    ],
  },
  {
    title: "Menus and pickers",
    items: [
      doc("components/menu", "Menu"),
      doc("components/context-menu", "Context Menu"),
      doc("components/menu-bar", "Menu Bar"),
      doc("components/select", "Pop-Up Button"),
      doc("components/combo-box", "Combo Box"),
      doc("components/command-palette", "Command Palette"),
    ],
  },
  {
    title: "Presentation",
    items: [
      doc("components/alert", "Alert"),
      doc("components/dialog", "Dialog"),
      doc("components/sheet", "Sheet"),
      doc("components/popover", "Popover"),
      doc("components/tooltip", "Tooltip"),
      doc("components/hover-card", "Hover Card"),
      doc("components/toast", "Notification"),
    ],
  },
  {
    title: "Navigation",
    items: [
      doc("components/window", "Window"),
      doc("components/device-frame", "Device Frame"),
      doc("components/sidebar", "Sidebar"),
      doc("components/toolbar", "Toolbar"),
      doc("components/navigation-bar", "Navigation Bar"),
      doc("components/tab-bar", "Tab Bar"),
      doc("components/tabs", "Tabs"),
      doc("components/split-view", "Split View"),
      doc("components/dock", "Dock"),
      doc("components/page-control", "Page Control"),
    ],
  },
  {
    title: "Content",
    items: [
      doc("components/list", "List"),
      doc("components/table", "Table"),
      doc("components/outline", "Outline"),
      doc("components/disclosure", "Disclosure"),
      doc("components/card", "Card"),
      doc("components/avatar", "Avatar"),
      doc("components/artwork", "Artwork"),
      doc("components/squircle", "Squircle"),
      doc("components/badge", "Badge"),
      doc("components/separator", "Separator"),
      doc("components/scroll-view", "Scroll View"),
      doc("components/carousel", "Carousel"),
    ],
  },
  {
    title: "Status",
    items: [
      doc("components/progress", "Progress"),
      doc("components/activity-indicator", "Activity Indicator"),
      doc("components/gauge", "Gauge"),
      doc("components/glass", "Glass"),
    ],
  },
  {
    title: "Charts",
    items: [
      doc("charts/overview", "Overview"),
      doc("charts/stocks", "Stocks"),
      doc("charts/health", "Health"),
      doc("charts/fitness", "Fitness"),
      doc("charts/general", "General"),
    ],
  },
  {
    title: "Home",
    items: [
      doc("home/overview", "Overview"),
      doc("home/accessory-tile", "Accessory Tile"),
      doc("home/scene-tile", "Scene Tile"),
      doc("home/home-status", "Home Status"),
      doc("home/home-section", "Home Section"),
      doc("home/level-control", "Level Control"),
      doc("home/light-color-picker", "Light Color Picker"),
      doc("home/thermostat-control", "Thermostat Control"),
      doc("home/lock-control", "Lock Control"),
      doc("home/door-control", "Door Control"),
      doc("home/camera-view", "Camera View"),
      doc("home/sensor-readout", "Sensor Readout"),
      doc("home/setup-code", "Setup Code"),
      doc("home/automation-row", "Automation Row"),
      doc("home/energy-readout", "Energy Readout"),
    ],
  },
]

/** The sections that hold component pages, in sidebar order. */
const componentSections = nav.filter((section) =>
  section.items.some((item) => item.href.startsWith("/docs/components/"))
)

const flatNav = nav.flatMap((section) => section.items.map((item) => ({ ...item, section: section.title })))

export { componentSections, flatNav, nav }
export type { NavItem, NavSection }
