"use client"

import { Avatar, AvatarFallback } from "macbetter/avatar"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu"
import {
  Window,
  WindowAppName,
  WindowBody,
  WindowTitle,
  WindowTitlebar,
  WindowTitlebarLeading,
  WindowTitlebarTrailing,
} from "macbetter/window"
import { KeyboardIcon, LogOutIcon, SettingsIcon, TerminalIcon, UserIcon } from "lucide-react"

const lines = [
  ["14:02:11.204", "200", "GET", "/v1/invoices?status=open", "38 ms"],
  ["14:02:11.391", "200", "POST", "/v1/payments", "112 ms"],
  ["14:02:12.018", "404", "GET", "/v1/customers/cus_8812", "9 ms"],
  ["14:02:12.540", "200", "GET", "/v1/invoices/inv_2290/pdf", "204 ms"],
  ["14:02:13.077", "500", "POST", "/v1/webhooks/stripe", "1,830 ms"],
  ["14:02:13.402", "200", "GET", "/v1/health", "2 ms"],
  ["14:02:14.155", "201", "POST", "/v1/customers", "64 ms"],
]

const statusColor = (code: string) =>
  code.startsWith("5") ? "var(--mb-red)" : code.startsWith("4") ? "var(--mb-orange)" : "var(--mb-label-secondary)"

export default function Example() {
  return (
    <Window aria-label="Relay, request log" style={{ maxWidth: 760, height: 300 }}>
      <WindowTitlebar variant="compact">
        <WindowTitlebarLeading>
          <WindowAppName
            icon={
              <Avatar shape="app" size="xs" color="gray">
                <AvatarFallback>
                  <TerminalIcon />
                </AvatarFallback>
              </Avatar>
            }
          >
            Relay
          </WindowAppName>
        </WindowTitlebarLeading>
        <WindowTitle align="center">api-gateway · production</WindowTitle>
        <WindowTitlebarTrailing>
          <Menu>
            <MenuTrigger
              variant="plain"
              tone="neutral"
              size="sm"
              shape="circle"
              indicator={false}
              aria-label="Account: Maya Okafor"
            >
              <Avatar size="xs" name="Maya Okafor" src="/demos/avatar-maya.svg" />
            </MenuTrigger>
            <MenuContent align="end">
              <MenuGroup>
                <MenuGroupLabel>maya@northwind.dev</MenuGroupLabel>
                <MenuItem value="profile">
                  <MenuItemIcon>
                    <UserIcon />
                  </MenuItemIcon>
                  Profile
                </MenuItem>
                <MenuItem value="preferences" shortcut="mod+,">
                  <MenuItemIcon>
                    <SettingsIcon />
                  </MenuItemIcon>
                  Preferences
                </MenuItem>
                <MenuItem value="shortcuts" shortcut="mod+/">
                  <MenuItemIcon>
                    <KeyboardIcon />
                  </MenuItemIcon>
                  Keyboard Shortcuts
                </MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem value="sign-out">
                <MenuItemIcon>
                  <LogOutIcon />
                </MenuItemIcon>
                Sign Out
              </MenuItem>
            </MenuContent>
          </Menu>
        </WindowTitlebarTrailing>
      </WindowTitlebar>
      <WindowBody style={{ padding: "8px 0", font: "12px/20px var(--mb-font-mono)" }}>
        {lines.map(([time, code, method, path, duration]) => (
          <div
            key={time}
            style={{
              display: "grid",
              gridTemplateColumns: "96px 36px 44px minmax(0, 1fr) auto",
              gap: 12,
              padding: "0 16px",
              whiteSpace: "nowrap",
            }}
          >
            <span className="mb-label-secondary">{time}</span>
            <span style={{ color: statusColor(code) }}>{code}</span>
            <span>{method}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{path}</span>
            <span className="mb-label-secondary">{duration}</span>
          </div>
        ))}
      </WindowBody>
    </Window>
  )
}
