import { Artwork } from "macbetter/artwork"
import { Button } from "macbetter/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "macbetter/card"

export default function Example() {
  return (
    <Card variant="elevated" style={{ width: 320, overflow: "hidden", padding: 0 }}>
      <Artwork seed="Fitness Plus Yoga" variant="strata" palette="sunset" aspect={16 / 9} shape="square">
        <span className="mb-text-footnote" style={{ fontWeight: 600, textTransform: "uppercase", opacity: 0.85 }}>
          New series
        </span>
        <span className="mb-text-title-3">Yoga for Runners</span>
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
