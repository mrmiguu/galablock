import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import useAsync from 'react-use/lib/useAsync'
import { tilePx } from './consts'
import { fetchSprite } from './importSprites'
import { sleep, stringify } from './utils'

type BlockPlanetFaceTileProps = {
  x: number
  y: number
  imageURLs: string[]
  duration?: number
}

function BlockPlanetFaceTile({ x, y, imageURLs, duration }: BlockPlanetFaceTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dur = duration ?? 2000
  const delay = 100 * (x + y)

  const {
    value: images,
    loading,
    error,
  } = useAsync(() => Promise.all(imageURLs.map(fetchSprite)), [stringify(imageURLs)])

  const [animFrame, setAnimFrame] = useState(0)

  useAsync(async () => {
    if (!images?.length) return

    await sleep(delay)

    const intervalId = setInterval(() => {
      setAnimFrame(animFrame => (animFrame + 1) % (images?.length ?? 1))
    }, dur)

    return () => {
      clearInterval(intervalId)
    }
  }, [images, dur, delay])

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
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 ${loading && 'animate-pulse'}`}
      width={tilePx}
      height={tilePx}
      style={{
        transform: `translate(${x * tilePx}px, ${y * tilePx}px)`,
      }}
    />
  )
}

export default BlockPlanetFaceTile
export type { BlockPlanetFaceTileProps }
