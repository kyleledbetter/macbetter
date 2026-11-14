import { Button } from "macbetter/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "macbetter/card"

export default function Example() {
  return (
    // Grouped cards sit on the grouped background, the way iOS Settings draws them.
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        width: "100%",
        padding: 16,
        borderRadius: 16,
        background: "var(--mb-bg-grouped)",
      }}
    >
      <Card variant="grouped">
        <CardHeader>
          <CardTitle>Storage</CardTitle>
          <CardDescription>412 GB of 1 TB used</CardDescription>
        </CardHeader>
        <CardContent>Photos and Messages take the most space on this Mac.</CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Software Update</CardTitle>
          <CardDescription>macOS 26.1 is ready to install.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="filled">
            Update Now
          </Button>
        </CardFooter>
      </Card>
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Family Sharing</CardTitle>
          <CardDescription>Share subscriptions, purchases and location with up to five people.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
