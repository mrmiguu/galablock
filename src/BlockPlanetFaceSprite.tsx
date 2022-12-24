import { useEffect } from 'react'
import toast from 'react-hot-toast'

import tempImageURL from './assets/sprites/ACTION RPG MATERIAL VOL.2/Mapchip/til2_01.png'
import { tilePx } from './consts'
import * as importSprites from './importSprites'
import { useImport } from './utils'

type BlockPlanetFaceSpriteProps = {
  x: number
  y: number
  rotate: number
  imageURL: string
}

function BlockPlanetFaceSprite({ x, y, rotate = 0, imageURL }: BlockPlanetFaceSpriteProps) {
  const { value: loadedImageURL, error } = useImport(importSprites.imports, imageURL)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <div
      className={`absolute top-0 left-0 ${!loadedImageURL && 'animate-pulse'}`}
      // transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-1000
      style={{
        width: `${tilePx}px`,
        height: `${tilePx}px`,
        transform: `translate(${x * tilePx}px, ${y * tilePx}px) rotate(${rotate}deg)`,
      }}
    >
      <div
        className="origin-bottom"
        // transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-1000
        style={{
          width: `${tilePx}px`,
          height: `${tilePx}px`,
          backgroundImage: `url("${loadedImageURL ?? tempImageURL}")`,
        }}
      ></div>
    </div>
  )
}

export default BlockPlanetFaceSprite
export type { BlockPlanetFaceSpriteProps }
