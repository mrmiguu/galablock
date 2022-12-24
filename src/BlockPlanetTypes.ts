import { blockPlanetFace } from './BlockPlanetStyles'

type Face = keyof typeof blockPlanetFace

type EngineState = {
  planetSize: number
  sprites: {
    [id: string]: {
      id: string
      sprite: string
      blockFace: Face
      x: number
      y: number
    }
  }
}

enum EngineAction {
  Up,
  Left,
  Down,
  Right,
}

type EngineMoveSpritePayload = {
  type: EngineAction.Up | EngineAction.Left | EngineAction.Down | EngineAction.Right
  spriteId: string
}

type EngineActionPayload = EngineMoveSpritePayload

export type { Face, EngineState, EngineMoveSpritePayload, EngineActionPayload }
export { EngineAction }
