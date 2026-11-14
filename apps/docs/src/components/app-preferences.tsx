"use client"

import { Preferences } from "@ui-sdk/react/preferences"
import { colorScheme, theme } from "@/lib/preferences"

function AppPreferences({ children }: { children: React.ReactNode }) {
  return <Preferences preferences={[colorScheme, theme]}>{children}</Preferences>
}

export { AppPreferences }
