import { CSSProperties } from 'react'
import { tilePx } from './consts'

const initialDegDiffFromCenter = 33

function calc(centerDeg: number, initialDegDiffFromCenter: number, tile: number, totalTiles: number) {
  const tilePerc = (tile + 0.5) / totalTiles
  const from = centerDeg + initialDegDiffFromCenter
  const fullThreshDiff = -initialDegDiffFromCenter * 2
  const diff = fullThreshDiff * tilePerc
  return from + diff
}

// transform rotation order really matters here
const blockPlanetFace = {
  top: {
    cameraTransform: (x: number, y: number, tiles: number) =>
      `rotateX(${calc(-90, -initialDegDiffFromCenter, y, tiles)}deg)
       rotateZ(${calc(0, initialDegDiffFromCenter, x, tiles)}deg)`,
    faceTransform: (tiles: number) => `rotateX(90deg) translateZ(${(tiles * tilePx) / 2}px)`,
  },
  left: {
    cameraTransform: (x: number, y: number, tiles: number) =>
      `rotateY(${calc(90, initialDegDiffFromCenter, x, tiles)}deg)
       rotateZ(${calc(0, -initialDegDiffFromCenter, y, tiles)}deg)`,
    faceTransform: (tiles: number) => `rotateY(-90deg) translateZ(${(tiles * tilePx) / 2}px)`,
  },
  front: {
    cameraTransform: (x: number, y: number, tiles: number) =>
      `rotateY(${calc(0, initialDegDiffFromCenter, x, tiles)}deg)
       rotateX(${calc(0, -initialDegDiffFromCenter, y, tiles)}deg)`,
    faceTransform: (tiles: number) => `rotateY(0deg) translateZ(${(tiles * tilePx) / 2}px)`,
  },
  right: {
    cameraTransform: (x: number, y: number, tiles: number) =>
      `rotateY(${calc(-90, initialDegDiffFromCenter, x, tiles)}deg)
       rotateZ(${calc(0, initialDegDiffFromCenter, y, tiles)}deg)`,
    faceTransform: (tiles: number) => `rotateY(90deg) translateZ(${(tiles * tilePx) / 2}px)`,
  },
  bottom: {
    cameraTransform: (x: number, y: number, tiles: number) =>
      `rotateX(${calc(90, -initialDegDiffFromCenter, y, tiles)}deg)
       rotateZ(${calc(0, -initialDegDiffFromCenter, x, tiles)}deg)`,
    faceTransform: (tiles: number) => `rotateX(-90deg) translateZ(${(tiles * tilePx) / 2}px)`,
  },
  back: {
    cameraTransform: (x: number, y: number, tiles: number) =>
      `rotateX(${calc(180, -initialDegDiffFromCenter, y, tiles)}deg)
       rotateY(${calc(0, -initialDegDiffFromCenter, x, tiles)}deg)`,
    faceTransform: (tiles: number) => `rotateX(180deg) translateZ(${(tiles * tilePx) / 2}px)`,
  },
} as const

const blockPlanetFaceWidthHeight = (tilesWide: number): CSSProperties => ({
  width: `${tilesWide * tilePx}px`,
  height: `${tilesWide * tilePx}px`,
})

export { blockPlanetFace, blockPlanetFaceWidthHeight }
