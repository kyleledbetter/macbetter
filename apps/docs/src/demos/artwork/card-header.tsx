import { Artwork } from "@dreambase/stardust/artwork"
import { Button } from "@dreambase/stardust/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@dreambase/stardust/card"

export default function Example() {
  return (
    <Card variant="elevated" style={{ width: 320, overflow: "hidden", padding: 0 }}>
      <Artwork seed="Fitness Plus Yoga" variant="strata" palette="sunset" aspect={16 / 9} shape="square">
        <span className="sd-text-footnote" style={{ fontWeight: 600, textTransform: "uppercase", opacity: 0.85 }}>
          New series
        </span>
        <span className="sd-text-title-3">Yoga for Runners</span>
      </Artwork>
      <CardHeader style={{ padding: "14px 16px 0" }}>
        <CardTitle>Week one: hips and hamstrings</CardTitle>
        <CardDescription>Six 10-minute sessions to do after a run.</CardDescription>
      </CardHeader>
      <CardFooter style={{ padding: 16 }}>
        <Button size="sm" variant="filled">
          Start Session
        </Button>
      </CardFooter>
    </Card>
  )
}
