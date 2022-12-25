import { blockPlanetFace } from './BlockPlanetStyles'

type Face = keyof typeof blockPlanetFace

enum Direction {
  Up,
  Left,
  Down,
  Right,
}

type Sprite = {
  id: string
  sprite: string
  blockFace: Face
  x: number
  y: number
}

type Map = {
  size: number
}

type EngineState = {
  map: Map
  sprites: {
    [id: string]: Sprite
  }
}

enum Action {
  SetMap,
  CreateSprite,
  UpdateSprite,
  DeleteSprite,
  MoveSprite,
}

type SetMapPayload = {
  type: Action.SetMap
  map: Map
}

type CreateSpritePayload = {
  type: Action.CreateSprite
  sprite: Sprite
}
type UpdateSpritePayload = {
  type: Action.UpdateSprite
  sprite: Pick<Sprite, 'id'> & Partial<Omit<Sprite, 'id'>>
}
type DeleteSpritePayload = {
  type: Action.DeleteSprite
  spriteId: string
}

type MoveSpritePayload = {
  type: Action.MoveSprite
  dir: Direction.Up | Direction.Left | Direction.Down | Direction.Right
  spriteId: string
}

type EngineActionPayload =
  | SetMapPayload
  | MoveSpritePayload
  | CreateSpritePayload
  | UpdateSpritePayload
  | DeleteSpritePayload

export type { Face, Sprite, EngineState, EngineActionPayload }
export { Action, Direction }
