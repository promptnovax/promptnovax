import * as React from "react"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }: SliderProps) {
  const current = value?.[0] ?? 0
  return (
    <div className="w-full flex items-center gap-3">
      <input
        type="range"
        className="w-full h-2 rounded-lg appearance-none bg-muted cursor-pointer"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onValueChange([Number(e.target.value)])}
      />
      <span className="text-xs text-muted-foreground w-10 text-right">{current}</span>
    </div>
  )
}

export default Slider


