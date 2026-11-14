import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dreambase/stardust/table"

const devices = [
  { id: "mbp", name: "MacBook Pro", os: "macOS 26.1", seen: "Now" },
  { id: "iphone", name: "iPhone 17 Pro", os: "iOS 26.1", seen: "2 minutes ago" },
  { id: "ipad", name: "iPad Air", os: "iPadOS 26.0", seen: "Yesterday" },
  { id: "studio", name: "Mac Studio", os: "macOS 26.1", seen: "Nov 9" },
]

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <Table aria-label="Signed-in devices">
        <TableHeader>
          <TableColumn>Device</TableColumn>
          <TableColumn>Software</TableColumn>
          <TableColumn align="end">Last seen</TableColumn>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id} value={device.id}>
              <TableCell>{device.name}</TableCell>
              <TableCell secondary>{device.os}</TableCell>
              <TableCell secondary align="end">
                {device.seen}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
