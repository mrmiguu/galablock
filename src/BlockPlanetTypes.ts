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
  hp: number
  pain?: boolean
}

enum Planet {
  Tutorial,
  Eden,
}

type PlanetData = {
  number: Planet
  size: number
}

type EngineState = {
  planet: PlanetData
  sprites: {
    [id: string]: Sprite
  }
}

enum Action {
  SetPlanet,
  CreateSprite,
  UpdateSprite,
  DeleteSprite,
  MoveSprite,
}

type SetPlanetPayload = {
  type: Action.SetPlanet
  planet: Planet
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
  | SetPlanetPayload
  | MoveSpritePayload
  | CreateSpritePayload
  | UpdateSpritePayload
  | DeleteSpritePayload

export type { Face, Sprite, EngineState, EngineActionPayload }
export { Planet, Action, Direction }
