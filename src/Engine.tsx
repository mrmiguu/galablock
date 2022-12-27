import produce, { Draft } from 'immer'
import { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from 'react'
import {
  Action,
  Direction,
  EngineActionPayload,
  EngineState,
  Face,
  Planet,
  Sprite,
  SpriteKind,
} from './BlockPlanetTypes'
import { useSound } from './importSounds'
import { values } from './utils'

const EngineContext = createContext<[EngineState, Dispatch<EngineActionPayload>]>(undefined as any)

function EngineProvider({ children }: PropsWithChildren) {
  const { value: stepSound } = useSound('step', { volume: 0.2 })
  const { value: bumpSound } = useSound('bump', { volume: 0.2 })
  const { value: hitSound } = useSound('hit', { volume: 0.2 })

  const reduce = (engine: Draft<EngineState>, payload: EngineActionPayload) => {
    const { sprites, planet } = engine
    const endTile = planet.size - 1

    if (payload.action === Action.SetPlanet) {
      planet.number = payload.planet
    }

    if (payload.action === Action.MoveSprite) {
      const sprite = sprites[payload.spriteId]

      if (sprite) {
        let { id, x, y, dir, hp, kind, blockFace } = sprite

        if (payload.dir === Direction.Up) {
          if (y === 0) {
            const sw: Record<Face, Function> = {
              top() {
                blockFace = 'back'
                y = endTile
              },
              left() {
                blockFace = 'top'
                x = 0
                y = sprite.x
                dir = Direction.Right
              },
              front() {
                blockFace = 'top'
                y = endTile
              },
              right() {
                blockFace = 'top'
                x = endTile
                y = endTile - sprite.x
                dir = Direction.Left
              },
              bottom() {
                blockFace = 'front'
                y = endTile
              },
              back() {
                blockFace = 'bottom'
                y = endTile
              },
            }
            sw[blockFace]()
          } else y--
        }

        if (payload.dir === Direction.Left) {
          if (x === 0) {
            const sw: Record<Face, Function> = {
              top() {
                blockFace = 'left'
                x = sprite.y
                y = 0
                dir = Direction.Down
              },
              left() {
                blockFace = 'back'
                x = 0
                y = endTile - sprite.y
                dir = Direction.Right
              },
              front() {
                blockFace = 'left'
                x = endTile
              },
              right() {
                blockFace = 'front'
                x = endTile
              },
              bottom() {
                blockFace = 'left'
                y = endTile
                x = endTile - sprite.y
                dir = Direction.Up
              },
              back() {
                blockFace = 'left'
                x = 0
                y = endTile - sprite.y
                dir = Direction.Right
              },
            }
            sw[blockFace]()
          } else x--
        }

        if (payload.dir === Direction.Down) {
          if (y === endTile) {
            const sw: Record<Face, Function> = {
              top() {
                blockFace = 'front'
                y = 0
              },
              left() {
                blockFace = 'bottom'
                x = 0
                y = endTile - sprite.x
                dir = Direction.Right
              },
              front() {
                blockFace = 'bottom'
                y = 0
              },
              right() {
                blockFace = 'bottom'
                x = endTile
                y = sprite.x
                dir = Direction.Left
              },
              bottom() {
                blockFace = 'back'
                y = 0
              },
              back() {
                blockFace = 'top'
                y = 0
              },
            }
            sw[blockFace]()
          } else y++
        }

        if (payload.dir === Direction.Right) {
          if (x === endTile) {
            const sw: Record<Face, Function> = {
              top() {
                blockFace = 'right'
                x = endTile - sprite.y
                y = 0
                dir = Direction.Down
              },
              left() {
                blockFace = 'front'
                x = 0
              },
              front() {
                blockFace = 'right'
                x = 0
              },
              right() {
                blockFace = 'back'
                x = endTile
                y = endTile - sprite.y
                dir = Direction.Left
              },
              bottom() {
                blockFace = 'right'
                x = sprite.y
                y = endTile
                dir = Direction.Up
              },
              back() {
                blockFace = 'right'
                x = endTile
                y = endTile - sprite.y
                dir = Direction.Left
              },
            }
            sw[blockFace]()
          } else x++
        }

        const collision = values(sprites).find(s => s.blockFace === blockFace && s.x === x && s.y === y)
        const strike =
          hp !== 0 &&
          collision &&
          collision.hp > 0 &&
          (kind === SpriteKind.Player || collision.kind === SpriteKind.Player)
        const struck =
          collision &&
          hp > 0 &&
          (collision.kind === SpriteKind.Aggressive ||
            collision.kind === SpriteKind.Defensive ||
            collision.kind === SpriteKind.Player)
        const collide = collision && collision.hp !== 0

        if (collide) {
          blockFace = sprite.blockFace
          x = sprite.x
          y = sprite.y
          dir = sprite.dir
        }

        const move = blockFace !== sprite.blockFace || y !== sprite.y || x !== sprite.x
        const bump = !move && !strike && !struck

        sprite.blockFace = blockFace
        sprite.x = x
        sprite.y = y
        sprite.dir = dir

        if ((kind === SpriteKind.Player && !bump) || kind !== SpriteKind.Player) {
          delete sprite.pain

          if (hp === 0) {
            delete sprites[id]
          }
        }

        if (!bump) {
          if (kind === SpriteKind.Player) {
            for (const otherId in sprites) {
              const other = sprites[otherId]!

              if (other.kind === SpriteKind.Aggressive) {
                reduce(engine, { action: Action.MoveSprite, dir: other.dir, spriteId: otherId })
              }
            }
          }
        }

        if (strike) {
          collision.hp--
          collision.pain = true
        }

        if (strike) hitSound?.play()
        else if (move && kind === SpriteKind.Player) stepSound?.play()
        else if (bump && kind === SpriteKind.Player) bumpSound?.play()
      }
    }

    if (payload.action === Action.CreateSprite) {
      engine.sprites[payload.sprite.id] = payload.sprite
    }

    if (payload.action === Action.UpdateSprite) {
      engine.sprites[payload.sprite.id] = {
        ...engine.sprites[payload.sprite.id],
        ...payload.sprite,
      } as Sprite
    }

    if (payload.action === Action.DeleteSprite) {
      delete engine.sprites[payload.spriteId]
    }
  }

  const engineContext = useReducer(
    (engine: EngineState, payload: EngineActionPayload) => produce(engine, engine => reduce(engine, payload)),
    {
      planet: {
        number: Planet.Tutorial,
        size: 9,
      },
      sprites: {},
    },
  )

  return <EngineContext.Provider value={engineContext}>{children}</EngineContext.Provider>
}

const useEngine = () => useContext(EngineContext)

export { EngineProvider, useEngine }
