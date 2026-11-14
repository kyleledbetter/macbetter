"use client"

import { Preferences } from "@ui-sdk/react/preferences"
import { colorScheme, motion, theme, transparency } from "@/lib/preferences"

function AppPreferences({ children }: { children: React.ReactNode }) {
  return <Preferences preferences={[colorScheme, theme, motion, transparency]}>{children}</Preferences>
}

export { AppPreferences }
