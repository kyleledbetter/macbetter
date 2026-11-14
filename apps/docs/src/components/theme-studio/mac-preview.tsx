"use client";

import { Badge } from "macbetter/badge";
import { Button } from "macbetter/button";
import { Checkbox } from "macbetter/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "macbetter/field";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "macbetter/progress";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "macbetter/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "macbetter/select";
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
} from "macbetter/sidebar";
import { Slider } from "macbetter/slider";
import { Switch } from "macbetter/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "macbetter/tabs";
import { TextField } from "macbetter/text-field";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSearchField,
  ToolbarSpacer,
  ToolbarTitle,
} from "macbetter/toolbar";
import {
  Window,
  WindowBody,
  WindowSidebar,
  WindowTitlebar,
  WindowTrafficLights,
} from "macbetter/window";
import {
  ArchiveIcon,
  CalendarClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  CopyIcon,
  FilePenIcon,
  ImageIcon,
  InboxIcon,
  SendIcon,
  ShareIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";

const places = [
  { name: "Drafts", icon: FilePenIcon, badge: 3 },
  { name: "Scheduled", icon: CalendarClockIcon },
  { name: "Sent", icon: SendIcon },
  { name: "Archive", icon: ArchiveIcon },
];

const lists = [
  { name: "Customers", color: "var(--mb-accent)" },
  { name: "Trial users", color: "var(--mb-accent-secondary)" },
  { name: "Press", color: "var(--mb-green)" },
];

function MacPreview() {
  const [place, setPlace] = useState("Drafts");
  const [when, setWhen] = useState("later");

  return (
    <Window aria-label="Campaigns" className="ts-mac-window">
      <WindowSidebar>
        <WindowTrafficLights />
        <Sidebar aria-label="Campaigns">
          <SidebarSection title="Campaigns">
            <SidebarItem
              icon={<InboxIcon />}
              current={place === "All"}
              onClick={() => setPlace("All")}
            >
              All campaigns
            </SidebarItem>
            {places.map(({ name, icon: Icon, badge }) => (
              <SidebarItem
                key={name}
                icon={<Icon />}
                badge={badge}
                current={place === name}
                onClick={() => setPlace(name)}
              >
                {name}
              </SidebarItem>
            ))}
          </SidebarSection>
          <SidebarSection title="Audiences">
            {lists.map((list) => (
              <SidebarItem
                key={list.name}
                tint={list.color}
                icon={<CircleIcon fill="currentColor" strokeWidth={0} />}
                current={place === list.name}
                onClick={() => setPlace(list.name)}
              >
                {list.name}
              </SidebarItem>
            ))}
          </SidebarSection>
        </Sidebar>
      </WindowSidebar>
      <WindowTitlebar>
        <Toolbar aria-label="Campaign">
          <ToolbarGroup aria-label="History">
            <ToolbarButton aria-label="Back">
              <ChevronLeftIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton aria-label="Forward" disabled>
              <ChevronRightIcon aria-hidden="true" />
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarTitle subtitle="3 drafts">
            {place === "All" ? "All campaigns" : place}
          </ToolbarTitle>
          <ToolbarSpacer />
          <ToolbarButton aria-label="Share">
            <ShareIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search campaigns" />
        </Toolbar>
      </WindowTitlebar>
      <WindowBody className="ts-mac-body">
        <div className="ts-mac-content">
          <div className="ts-mac-heading">
            <div>
              <div className="ts-inline">
                <h2>Spring launch</h2>
                <Badge>Draft</Badge>
              </div>
              <p>Edited 2 minutes ago by Inès Moreau</p>
            </div>
            <div className="ts-mac-heading-actions">
              <Button variant="plain">Preview</Button>
              <Menu>
                <MenuTrigger>Actions</MenuTrigger>
                <MenuContent>
                  <MenuItem value="duplicate" shortcut="mod+d">
                    <MenuItemIcon>
                      <CopyIcon />
                    </MenuItemIcon>
                    Duplicate
                  </MenuItem>
                  <MenuItem value="archive">
                    <MenuItemIcon>
                      <ArchiveIcon />
                    </MenuItemIcon>
                    Archive
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem value="delete" destructive shortcut="mod+backspace">
                    <MenuItemIcon>
                      <TrashIcon />
                    </MenuItemIcon>
                    Delete
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
          </div>

          <div className="ts-cover">
            <div>
              <strong>New colors for spring</strong>
              <small>Header image · 1200 × 400</small>
            </div>
            <Button variant="glass" size="sm">
              <ImageIcon aria-hidden="true" />
              Change image
            </Button>
          </div>

          <div className="ts-mac-grid">
            <section className="ts-panel" aria-label="Details">
              <FieldGroup layout="horizontal">
                <Field name="subject">
                  <FieldLabel>Subject:</FieldLabel>
                  <TextField defaultValue="Our spring collection is here" />
                </Field>
                <Field name="audience">
                  <FieldLabel>Audience:</FieldLabel>
                  <Select defaultValue="customers">
                    <SelectTrigger style={{ width: "100%" }} />
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="trial">Trial users</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field name="send">
                  <FieldLabel>Send:</FieldLabel>
                  <SegmentedControl
                    aria-label="Send"
                    value={when}
                    onValueChange={(value) => value && setWhen(value)}
                  >
                    <SegmentedControlItem value="now">Now</SegmentedControlItem>
                    <SegmentedControlItem value="later">
                      Later
                    </SegmentedControlItem>
                    <SegmentedControlItem value="local">
                      Local time
                    </SegmentedControlItem>
                  </SegmentedControl>
                </Field>
                <Field name="rate">
                  <FieldLabel>Daily limit:</FieldLabel>
                  <Slider defaultValue={60} thumbLabel="Daily limit" />
                  <FieldDescription>About 6,000 emails a day.</FieldDescription>
                </Field>
                <Field name="track">
                  <FieldLabel>Track opens:</FieldLabel>
                  <Switch defaultChecked />
                </Field>
              </FieldGroup>
              <Checkbox defaultChecked>Send me a test email first</Checkbox>
              <div className="ts-inline" data-end="">
                <Button>Cancel</Button>
                <Button variant="tinted">Save draft</Button>
                <Button variant="filled">Schedule</Button>
              </div>
            </section>

            <Tabs defaultValue="results">
              <TabsList aria-label="Campaign">
                <TabsTab value="results">Results</TabsTab>
                <TabsTab value="audience">Audience</TabsTab>
              </TabsList>
              <TabsPanel value="results">
                <div className="ts-stats">
                  <Progress value={72}>
                    <ProgressLabel>Delivered</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                  <Progress value={41} tone="neutral">
                    <ProgressLabel>Opened</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                  <div className="ts-inline">
                    <Badge variant="dot" color="green">
                      Healthy list
                    </Badge>
                    <Badge color="green">+12% opens</Badge>
                    <Badge color="red">3 bounced</Badge>
                    <Badge variant="outline" color="gray">
                      A/B test
                    </Badge>
                  </div>
                  <div className="ts-inline">
                    <Button variant="tinted" tone="destructive" size="sm">
                      <TrashIcon aria-hidden="true" />
                      Delete campaign
                    </Button>
                    <Button variant="plain" size="sm">
                      <UsersIcon aria-hidden="true" />
                      View recipients
                    </Button>
                  </div>
                </div>
              </TabsPanel>
              <TabsPanel value="audience">
                <div className="ts-stats">
                  <Checkbox defaultChecked>Customers</Checkbox>
                  <Checkbox>Trial users</Checkbox>
                  <Checkbox>Press</Checkbox>
                </div>
              </TabsPanel>
            </Tabs>
          </div>
        </div>
      </WindowBody>
    </Window>
  );
}

export { MacPreview };
