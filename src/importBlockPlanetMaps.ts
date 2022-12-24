import { Face } from './BlockPlanetTypes'
import { fetchImport } from './utils'

const imports = import.meta.glob<{ default: any }>('./blockPlanetMap*.json')

type BlockPlanetMapLegendData = {
  tiles: {
    [key: string]: string[]
  }
  sprites: {
    [key: string]: string[]
  }
}

type RawBlockPlanetFaceTileData = string[]
type RawBlockPlanetMapTileData = [
  RawBlockPlanetFaceTileData,
  RawBlockPlanetFaceTileData, // left, front, and right; divide by 3
  RawBlockPlanetFaceTileData,
  RawBlockPlanetFaceTileData,
]

type BlockPlanetFaceTileData = string[][]
type BlockPlanetMapTileData = { [face in Face]: BlockPlanetFaceTileData }

type BlockPlanetMapData = {
  legend: BlockPlanetMapLegendData
  tiles: BlockPlanetMapTileData
}

async function fetchMapDataImport(mapNumber: number): Promise<BlockPlanetMapData> {
  const legend = await fetchImport<BlockPlanetMapLegendData>(imports, './blockPlanetMapLegend.json')

  const mapNumberPaddedWithZeroes = `${mapNumber}`.padStart(2, '0')
  const rawMapTileData = await fetchImport<RawBlockPlanetMapTileData>(
    imports,
    `./blockPlanetMapTiles_${mapNumberPaddedWithZeroes}.json`,
  )

  const tiles: BlockPlanetMapTileData = {
    top: rawMapTileData[0].map(raw => raw.split('`')),
    left: rawMapTileData[1].filter((_, i) => i % 3 === 0).map(raw => raw.split('`')),
    front: rawMapTileData[1].filter((_, i) => i % 3 === 1).map(raw => raw.split('`')),
    right: rawMapTileData[1].filter((_, i) => i % 3 === 2).map(raw => raw.split('`')),
    bottom: rawMapTileData[2].map(raw => raw.split('`')),
    back: rawMapTileData[3].map(raw => raw.split('`')),
  }

  return { legend, tiles }
}

export type { BlockPlanetFaceTileData, BlockPlanetMapData }
export { imports, fetchMapDataImport }
