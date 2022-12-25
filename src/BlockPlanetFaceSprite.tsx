import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useAsync } from 'react-use'

import { tilePx } from './consts'
import { fetchSprite } from './importSprites'
import { stringify } from './utils'

type SingleAnimationFrame = {
  imageURL: string
}
type MultipleAnimationFrames = {
  imageURLs: string[]
}

type BlockPlanetFaceSpriteProps = {
  x: number
  y: number
  rotate: number
} & (SingleAnimationFrame | MultipleAnimationFrames)

function BlockPlanetFaceSprite({ x, y, rotate = 0, ...props }: BlockPlanetFaceSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const imageURLs = 'imageURL' in props ? [props.imageURL] : props.imageURLs

  const {
    value: images,
    loading,
    error,
  } = useAsync(() => Promise.all(imageURLs.map(fetchSprite)), [stringify(imageURLs)])

  const [animFrame, setAnimFrame] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimFrame(animFrame => (animFrame + 1) % (images?.length ?? 1))
    }, 250)

    return () => {
      clearInterval(intervalId)
    }
  }, [images])

  const image = images?.[animFrame]

  useEffect(() => {
    if (!image) return
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0)
  }, [image])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <div
      className={`absolute top-0 left-0 ${loading && 'animate-pulse'}`}
      // transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-1000
      style={{
        width: `${tilePx}px`,
        height: `${tilePx}px`,
        transform: `translate(${x * tilePx}px, ${y * tilePx}px) rotate(${rotate}deg)`,
      }}
    >
      <canvas ref={canvasRef} className="origin-bottom" width={tilePx} height={tilePx} />
    </div>
  )
}

export default BlockPlanetFaceSprite
export type { BlockPlanetFaceSpriteProps }
