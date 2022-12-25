import produce from 'immer'
import { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from 'react'
import { Action, EngineActionPayload, Direction, EngineState, Sprite, Face, Planet } from './BlockPlanetTypes'
import { useSound } from './importSounds'
import { values } from './utils'

const EngineContext = createContext<[EngineState, Dispatch<EngineActionPayload>]>(undefined as any)

function EngineProvider({ children }: PropsWithChildren) {
  const { value: stepSound } = useSound('step', { volume: 0.2 })
  const { value: bumpSound } = useSound('bump', { volume: 0.2 })
  const { value: hitSound } = useSound('hit', { volume: 0.2 })

  const engineContext = useReducer(
    (engine: EngineState, payload: EngineActionPayload) =>
      produce(engine, engine => {
        for (const spriteId in engine.sprites) {
          const sprite = engine.sprites[spriteId]!

          delete sprite.pain

          if (sprite.hp === 0) {
            delete engine.sprites[spriteId]
          }
        }

        if (payload.type === Action.SetPlanet) {
          engine.planet.number = payload.planet
        }

        if (payload.type === Action.MoveSprite) {
          const sprite = engine.sprites[payload.spriteId]

          if (sprite) {
            const endTile = engine.planet.size - 1
            let { x, y, blockFace } = sprite
            let tryMoving = false

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
                  },
                  front() {
                    blockFace = 'top'
                    y = endTile
                  },
                  right() {
                    blockFace = 'top'
                    x = endTile
                    y = endTile - sprite.x
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

              tryMoving = true
            }

            if (payload.dir === Direction.Left) {
              if (x === 0) {
                const sw: Record<Face, Function> = {
                  top() {
                    blockFace = 'left'
                    x = sprite.y
                    y = 0
                  },
                  left() {
                    blockFace = 'back'
                    x = 0
                    y = endTile - sprite.y
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
                  },
                  back() {
                    blockFace = 'left'
                    x = 0
                    y = endTile - sprite.y
                  },
                }
                sw[blockFace]()
              } else x--

              tryMoving = true
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
                  },
                  front() {
                    blockFace = 'bottom'
                    y = 0
                  },
                  right() {
                    blockFace = 'bottom'
                    x = endTile
                    y = sprite.x
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

              tryMoving = true
            }

            if (payload.dir === Direction.Right) {
              if (x === endTile) {
                const sw: Record<Face, Function> = {
                  top() {
                    blockFace = 'right'
                    x = endTile - sprite.y
                    y = 0
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
                  },
                  bottom() {
                    blockFace = 'right'
                    x = sprite.y
                    y = endTile
                  },
                  back() {
                    blockFace = 'right'
                    x = endTile
                    y = endTile - sprite.y
                  },
                }
                sw[blockFace]()
              } else x++

              tryMoving = true
            }

            if (tryMoving) {
              const collision = values(engine.sprites).find(s => s.blockFace === blockFace && s.x === x && s.y === y)

              if (collision) {
                if (collision.hp > 0) {
                  collision.hp--
                  collision.pain = true
                  hitSound?.play()
                }

                blockFace = sprite.blockFace
                x = sprite.x
                y = sprite.y
              }

              if (y !== sprite.y || x !== sprite.x) stepSound?.play()
              else bumpSound?.play()
            }

            sprite.blockFace = blockFace
            sprite.x = x
            sprite.y = y
          }
        }

        if (payload.type === Action.CreateSprite) {
          engine.sprites[payload.sprite.id] = payload.sprite
        }
        if (payload.type === Action.UpdateSprite) {
          engine.sprites[payload.sprite.id] = {
            ...engine.sprites[payload.sprite.id],
            ...payload.sprite,
          } as Sprite
        }
        if (payload.type === Action.DeleteSprite) {
          delete engine.sprites[payload.spriteId]
        }
      }),
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
