import { useAsync } from 'react-use'
import { Face } from './BlockPlanetTypes'
import { fetchImport } from './utils'

const imports = import.meta.glob<{ default: any }>('./blockPlanetMap*.json')

type TileKind = 'block'

type BlockPlanetMapLegendData = {
  tiles: {
    [key: string]: string[]
  }
  kinds: {
    [key: string]: TileKind
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

const cache: { [mapNumber: number]: BlockPlanetMapData } = {}

async function fetchMapDataImport(mapNumber: number): Promise<BlockPlanetMapData> {
  if (!(mapNumber in cache)) {
    const legend = await fetchImport<BlockPlanetMapLegendData>(imports, './blockPlanetMapLegend.json')

    const mapNumberPaddedWithZeroes = `${mapNumber}`.padStart(2, '0')
    const rawMapTileData = await fetchImport<RawBlockPlanetMapTileData>(
      imports,
      `./blockPlanetMapTiles_${mapNumberPaddedWithZeroes}.json`,
    )

    const sepChar = '.'

    const tiles: BlockPlanetMapTileData = {
      top: rawMapTileData[0].map(raw => raw.split(sepChar)),
      left: rawMapTileData[1].filter((_, i) => i % 3 === 0).map(raw => raw.split(sepChar)),
      front: rawMapTileData[1].filter((_, i) => i % 3 === 1).map(raw => raw.split(sepChar)),
      right: rawMapTileData[1].filter((_, i) => i % 3 === 2).map(raw => raw.split(sepChar)),
      bottom: rawMapTileData[2].map(raw => raw.split(sepChar)),
      back: rawMapTileData[3].map(raw => raw.split(sepChar)),
    }

    cache[mapNumber] = { legend, tiles }
  }

  return cache[mapNumber]!
}

const useMapDataImport = (mapNumber: number) => useAsync(() => fetchMapDataImport(mapNumber), [mapNumber])

export type { BlockPlanetFaceTileData, BlockPlanetMapData }
export { imports, fetchMapDataImport, useMapDataImport }
