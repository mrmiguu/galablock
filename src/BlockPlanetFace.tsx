import BlockPlanetFaceSprite from './BlockPlanetFaceSprite'
import BlockPlanetFaceTile from './BlockPlanetFaceTile'
import * as styles from './BlockPlanetStyles'
import { Face } from './BlockPlanetTypes'
import { useEngine } from './Engine'
import { BlockPlanetMapData } from './importBlockPlanetMaps'
import { values } from './utils'

type BlockPlanetFaceProps = {
  face: Face
  mapData: BlockPlanetMapData
}

function BlockPlanetFace({ face, mapData }: BlockPlanetFaceProps) {
  const [engine] = useEngine()
  const faceTileData = mapData.tiles[face]
  const tilesWide = faceTileData.length

  const sprites = values(engine.sprites).filter(s => s.blockFace === face)

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
          <BlockPlanetFaceTile key={`${x},${y}`} x={x} y={y} imageURLs={mapData.legend.tiles[tileLegendKey]!} />
        )),
      )}

      {sprites.map(({ id, x, y, sprite }) => (
        <BlockPlanetFaceSprite key={id} x={x} y={y} rotate={0} imageURLs={mapData.legend.sprites[sprite]!} />
      ))}
    </div>
  )
}

export default BlockPlanetFace
