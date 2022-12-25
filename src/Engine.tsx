import produce from 'immer'
import { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from 'react'
import { Action, EngineActionPayload, Direction, EngineState, Sprite } from './BlockPlanetTypes'
import { useSound } from './importSounds'
import { max, min } from './utils'

const EngineContext = createContext<[EngineState, Dispatch<EngineActionPayload>]>(undefined as any)

function EngineProvider({ children }: PropsWithChildren) {
  const { value: stepSound } = useSound('step', { volume: 0.2 })
  const { value: bumpSound } = useSound('bump', { volume: 0.2 })

  const engineContext = useReducer(
    (engine: EngineState, payload: EngineActionPayload) =>
      produce(engine, engine => {
        if (payload.type === Action.SetMap) {
          engine.map = payload.map
        }

        if (payload.type === Action.MoveSprite) {
          const sprite = engine.sprites[payload.spriteId]

          if (sprite) {
            const endTile = engine.map.size - 1
            let { x, y } = sprite
            let tryMoving = false

            if (payload.dir === Direction.Up) {
              y = max(0, min(endTile, y - 1))
              tryMoving = true
            }

            if (payload.dir === Direction.Left) {
              x = max(0, min(endTile, x - 1))
              tryMoving = true
            }

            if (payload.dir === Direction.Down) {
              y = max(0, min(endTile, y + 1))
              tryMoving = true
            }

            if (payload.dir === Direction.Right) {
              x = max(0, min(endTile, x + 1))
              tryMoving = true
            }

            if (tryMoving) {
              if (y !== sprite.y || x !== sprite.x) stepSound?.play()
              else bumpSound?.play()
            }

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
      map: {
        size: 0,
      },
      sprites: {},
    },
  )

  return <EngineContext.Provider value={engineContext}>{children}</EngineContext.Provider>
}

const useEngine = () => useContext(EngineContext)

export { EngineProvider, useEngine }
