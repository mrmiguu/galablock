import { useAsync } from 'react-use'
import BlockPlanetFace from './BlockPlanetFace'
import * as styles from './BlockPlanetStyles'
import { Face } from './BlockPlanetTypes'
import { tilePx } from './consts'
import { fetchMapDataImport } from './importBlockPlanetMaps'

type BlockPlanetProps = {
  mapNumber: number
  camera: Face
  cameraX: number
  cameraY: number
}

function BlockPlanet({ mapNumber, camera, cameraX, cameraY }: BlockPlanetProps) {
  const { value: mapData } = useAsync(() => fetchMapDataImport(mapNumber), [mapNumber])

  if (!mapData) return null

  const tilesWide = mapData.tiles.top.length

  return (
    <div
      style={{
        ...styles.blockPlanetFaceWidthHeight(tilesWide),
        perspective: `${500}px`,
        imageRendering: 'pixelated',
      }}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `translateZ(${(-tilesWide * tilePx) / 2}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="relative w-full h-full transition-transform ease-out duration-[1000ms]"
          style={{
            transform: styles.blockPlanetFace[camera].cameraTransform(cameraX, cameraY, tilesWide),
            transformStyle: 'preserve-3d',
          }}
        >
          <BlockPlanetFace face="top" mapData={mapData} />
          <BlockPlanetFace face="left" mapData={mapData} />
          <BlockPlanetFace face="front" mapData={mapData} />
          <BlockPlanetFace face="right" mapData={mapData} />
          <BlockPlanetFace face="bottom" mapData={mapData} />
          <BlockPlanetFace face="back" mapData={mapData} />
        </div>
      </div>
    </div>
  )
}

export default BlockPlanet
export type { BlockPlanetProps }
