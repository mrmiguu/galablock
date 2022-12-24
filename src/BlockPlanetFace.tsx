import BlockPlanetFaceSprite from './BlockPlanetFaceSprite'
import BlockPlanetFaceTile from './BlockPlanetFaceTile'
import * as styles from './BlockPlanetStyles'
import { Face } from './BlockPlanetTypes'
import { BlockPlanetMapData } from './importBlockPlanetMaps'

type BlockPlanetFaceProps = {
  face: Face
  mapData: BlockPlanetMapData
  camera: Face
  cameraX: number
  cameraY: number
}

function BlockPlanetFace({ face, mapData, cameraX, cameraY }: BlockPlanetFaceProps) {
  const faceTileData = mapData.tiles[face]
  const tilesWide = faceTileData.length

  return (
    <div
      className={`absolute`}
      style={{
        ...styles.blockPlanetFaceWidthHeight(tilesWide),
        transform: styles.blockPlanetFace[face].faceTransform(tilesWide),
      }}
    >
      {faceTileData.map((tileRowData, y) =>
        tileRowData.map((tileLegendKey, x) => (
          <BlockPlanetFaceTile key={`${x},${y}`} x={x} y={y} imageURL={mapData.legend.tiles[tileLegendKey]![0]!} />
        )),
      )}

      <BlockPlanetFaceSprite x={cameraX} y={cameraY} rotate={0} imageURL={mapData.legend.sprites['m1']![0]!} />
    </div>
  )
}

export default BlockPlanetFace
