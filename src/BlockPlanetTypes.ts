import { blockPlanetFace } from './BlockPlanetStyles'

type Face = keyof typeof blockPlanetFace

enum Direction {
  Up,
  Left,
  Down,
  Right,
}

enum SpriteKind {
  Player,
  NPC,
  Pacifist,
  Defensive,
  Aggressive,
}

type Sprite = {
  id: string
  sprite: string
  blockFace: Face
  x: number
  y: number
  dir: Direction
  hp: number
  pain?: boolean
  kind: SpriteKind
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
  action: Action.SetPlanet
  planet: Planet
}

type CreateSpritePayload = {
  action: Action.CreateSprite
  sprite: Sprite
}
type UpdateSpritePayload = {
  action: Action.UpdateSprite
  sprite: Pick<Sprite, 'id'> & Partial<Omit<Sprite, 'id'>>
}
type DeleteSpritePayload = {
  action: Action.DeleteSprite
  spriteId: string
}

type MoveSpritePayload = {
  action: Action.MoveSprite
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
export { SpriteKind, Planet, Action, Direction }
