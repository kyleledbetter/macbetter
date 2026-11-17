"use client"

import { MenuItem, MenuItemIcon, MenuSeparator } from "macbetter/menu"
import { Message, MessageActionCopy, MessageActionMenu, MessageActions, MessageContent } from "macbetter/message"
import { Response } from "macbetter/response"
import { FlagIcon, GitBranchIcon, ShareIcon } from "lucide-react"

const reply = "The deposit stays at one month’s rent. Clause 4.2 is unchanged from the old lease."

export default function Example() {
  return (
    <Message from="assistant" style={{ width: "100%", maxWidth: 560 }}>
      <MessageContent>
        <Response>
          <p>{reply}</p>
        </Response>
      </MessageContent>
      <MessageActions>
        <MessageActionCopy text={reply} />
        <MessageActionMenu label="More">
          <MenuItem value="branch">
            <MenuItemIcon>
              <GitBranchIcon aria-hidden="true" />
            </MenuItemIcon>
            Branch in new chat
          </MenuItem>
          <MenuItem value="share">
            <MenuItemIcon>
              <ShareIcon aria-hidden="true" />
            </MenuItemIcon>
            Share
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="report">
            <MenuItemIcon>
              <FlagIcon aria-hidden="true" />
            </MenuItemIcon>
            Report
          </MenuItem>
        </MessageActionMenu>
      </MessageActions>
    </Message>
  )
}
