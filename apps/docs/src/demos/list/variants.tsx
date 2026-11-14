import { List, ListRow, ListRowAccessory, ListRowTitle, ListRowValue, ListSection } from "macbetter/list"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", width: "100%" }}>
      <List variant="grouped">
        <ListSection header="Grouped" footer="Rows run edge to edge between hairlines.">
          <ListRow href="#name">
            <ListRowTitle>Name</ListRowTitle>
            <ListRowValue>Kai’s MacBook Pro</ListRowValue>
            <ListRowAccessory type="disclosure" />
          </ListRow>
          <ListRow>
            <ListRowTitle>Model</ListRowTitle>
            <ListRowValue>MacBook Pro 14-inch</ListRowValue>
          </ListRow>
        </ListSection>
      </List>
      <List variant="plain">
        <ListSection header="A">
          <ListRow href="#ada">
            <ListRowTitle>Ada Okafor</ListRowTitle>
          </ListRow>
          <ListRow href="#alex">
            <ListRowTitle>Alex Moreau</ListRowTitle>
          </ListRow>
        </ListSection>
        <ListSection header="B">
          <ListRow href="#bea">
            <ListRowTitle>Bea Lindqvist</ListRowTitle>
          </ListRow>
        </ListSection>
      </List>
    </div>
  )
}
