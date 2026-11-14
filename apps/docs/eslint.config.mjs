import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Reading the browser on mount (saved platform, URL hash, headings on the page) is the point of these effects.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // Demos are copied into other apps, so they use plain elements, not Next.js ones.
    files: ["src/demos/**", "src/components/landing/**", "src/app/apple-icon.tsx", "src/app/opengraph-image.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "jsx-a11y/alt-text": "off",
    },
  },
  globalIgnores([".next/**", ".next-build/**", "out/**", "build/**", "next-env.d.ts"]),
])

export default eslintConfig
