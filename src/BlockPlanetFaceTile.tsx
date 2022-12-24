import { useEffect } from 'react'
import toast from 'react-hot-toast'

import tempImageURL from './assets/sprites/ACTION RPG MATERIAL VOL.2/Mapchip/til2_01.png'
import { tilePx } from './consts'
import * as importSprites from './importSprites'
import { useImport } from './utils'

type BlockPlanetFaceTileProps = {
  x: number
  y: number
  imageURL: string
}

function BlockPlanetFaceTile({ x, y, imageURL }: BlockPlanetFaceTileProps) {
  const { value: loadedImageURL, error } = useImport(importSprites.imports, imageURL)

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  return (
    <div
      className={`absolute top-0 left-0 ${!loadedImageURL && 'animate-pulse'}`}
      style={{
        width: `${tilePx}px`,
        height: `${tilePx}px`,
        transform: `translate(${x * tilePx}px, ${y * tilePx}px)`,
        backgroundImage: `url("${loadedImageURL ?? tempImageURL}")`,
      }}
    ></div>
  )
}

export default BlockPlanetFaceTile
export type { BlockPlanetFaceTileProps }
