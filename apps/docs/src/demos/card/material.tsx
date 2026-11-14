import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@dreambase/stardust/card"

// A local CSS artwork stands in for a photo, so the material has something to blur.
const sky = {
  display: "grid",
  placeItems: "center",
  width: "100%",
  maxWidth: 520,
  padding: "40px 24px",
  borderRadius: 20,
  background:
    "radial-gradient(circle at 22% 28%, #ffd27a 0 12%, transparent 13%), radial-gradient(120% 90% at 80% 100%, #2f6fd6, transparent 60%), linear-gradient(160deg, #7cc4ff, #3a7bd5 55%, #f3a46b)",
} as const

export default function Example() {
  return (
    <div style={sky}>
      <Card variant="material" style={{ width: 280 }}>
        <CardHeader>
          <CardDescription>Cupertino</CardDescription>
          <CardTitle>72° Mostly Sunny</CardTitle>
        </CardHeader>
        <CardContent>High 78° · Low 55°. Clear skies through the evening.</CardContent>
      </Card>
    </div>
  )
}
