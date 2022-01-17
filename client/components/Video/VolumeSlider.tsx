import { ChangeEvent } from 'react'

type VolumeSliderProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  volume: number
}

export default function VolumeSlider({ onChange, volume }: VolumeSliderProps) {
  return (
    <input
      type="range"
      step="0.1"
      min={0}
      max={1}
      value={volume}
      onChange={onChange}
    />
  )
}
