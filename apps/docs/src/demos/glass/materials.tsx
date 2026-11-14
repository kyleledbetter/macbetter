import { Material, type MaterialThickness } from "@dreambase/stardust/glass"

const materials: Array<{ material: MaterialThickness; use: string }> = [
  { material: "ultrathin", use: "Over media, where the content is the point" },
  { material: "thin", use: "Small floating panels and HUDs" },
  { material: "regular", use: "Menus, popovers and most surfaces" },
  { material: "thick", use: "Sheets and inspectors over busy content" },
  { material: "chrome", use: "Toolbars, tab bars and title bars" },
  { material: "sidebar", use: "Source lists beside a window's content" },
]

export default function Example() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
        width: "100%",
        padding: 20,
        borderRadius: 18,
        backgroundImage: "url(/demos/wallpaper-coast.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {materials.map(({ material, use }) => (
        <Material
          key={material}
          material={material}
          style={{ display: "grid", gap: 4, padding: 16, borderRadius: 14, minHeight: 104, alignContent: "end" }}
        >
          <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{material}</span>
          <span style={{ color: "var(--sd-label-secondary)" }}>{use}</span>
        </Material>
      ))}
    </div>
  )
}
