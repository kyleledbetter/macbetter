const steps = [
  [1, 2],
  [2, 4],
  [3, 6],
  [4, 8],
  [5, 12],
  [6, 16],
  [7, 20],
  [8, 24],
  [9, 32],
  [10, 40],
  [11, 48],
  [12, 64],
] as const

export default function Spacing() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {steps.map(([step, size]) => (
        <div key={step} className="grid grid-cols-[110px_44px_1fr] items-center gap-3">
          <code className="font-mono text-[12px] text-label">--mb-space-{step}</code>
          <span className="text-end font-mono text-[12px] text-label-tertiary tabular-nums">{size}px</span>
          <div className="h-3 rounded-[3px] bg-accent" style={{ width: `var(--mb-space-${step})` }} />
        </div>
      ))}
    </div>
  )
}
