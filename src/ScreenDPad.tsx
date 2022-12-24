import { useState } from 'react'

type ScreenDPadArrowProps = {
  onClick: () => void
}

function ScreenDPadArrow({ onClick }: ScreenDPadArrowProps) {
  const [maxOpacity, setMaxOpacity] = useState(0.2)
  const [opacity, setOpacity] = useState(0)

  const onClickStart = () => {
    setOpacity(maxOpacity)
    setMaxOpacity(maxOpacity / 1.1)
  }

  const onClickEnd = () => {
    setOpacity(0)
    onClick()
  }

  return (
    <button
      className="w-full h-full transition duration-150 ease-in-out bg-white focus:outline-none focus:ring-0"
      style={{
        opacity,
      }}
      onTouchStart={onClickStart}
      onMouseDown={onClickStart}
      onMouseUp={onClickEnd}
    />
  )
}

type ScreenDPadProps = {
  onUp: () => void
  onLeft: () => void
  onDown: () => void
  onRight: () => void
}

function ScreenDPad({ onUp, onLeft, onDown, onRight }: ScreenDPadProps) {
  return (
    <div className="absolute flex items-center justify-center w-full h-full overflow-hidden">
      <div
        className="absolute flex flex-col top-1/2 left-1/2"
        style={{
          width: '150vmax',
          height: '150vmax',
          transform: `translate(-50%, -50%) rotate(${-45}deg)`,
        }}
      >
        <div className="flex w-full h-full">
          <ScreenDPadArrow onClick={onLeft} />
          <ScreenDPadArrow onClick={onUp} />
        </div>
        <div className="flex w-full h-full">
          <ScreenDPadArrow onClick={onDown} />
          <ScreenDPadArrow onClick={onRight} />
        </div>
      </div>
    </div>
  )
}

export default ScreenDPad
export type { ScreenDPadArrowProps, ScreenDPadProps }
