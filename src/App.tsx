import produce from 'immer'
import { useEffect, useReducer } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'

import BlockPlanet from './BlockPlanet'
import { EngineAction, EngineActionPayload, EngineState } from './BlockPlanetTypes'
import { tilePx } from './consts'
import { useSound } from './importSounds'
import ScreenDPad from './ScreenDPad'
import { keys, max, min } from './utils'

function App() {
  const { value: stepSound } = useSound('step', { volume: 0.2 })
  const { value: bumpSound } = useSound('bump', { volume: 0.2 })

  const myId = 'abc-123'

  const [engine, sendEngine] = useReducer(
    (engine: EngineState, { type, spriteId }: EngineActionPayload) =>
      produce(engine, engine => {
        const endTile = engine.planetSize - 1
        const sprite = engine.sprites[spriteId]

        if (sprite) {
          let { x, y } = sprite
          let tryMoving = false

          if (type === EngineAction.Up) {
            y = max(0, min(endTile, y - 1))
            tryMoving = true
          }

          if (type === EngineAction.Left) {
            x = max(0, min(endTile, x - 1))
            tryMoving = true
          }

          if (type === EngineAction.Down) {
            y = max(0, min(endTile, y + 1))
            tryMoving = true
          }

          if (type === EngineAction.Right) {
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
      }),
    {
      planetSize: 9,
      sprites: {
        [myId]: {
          id: myId,
          sprite: 'm1',
          blockFace: 'left',
          x: 1,
          y: 7,
        },
      },
    },
  )

  const { width, height } = useWindowSize(innerWidth, innerHeight)

  const blockPlanetWidthPx = engine.planetSize * tilePx

  const isPortrait = width < height
  const scale = (isPortrait ? width / blockPlanetWidthPx : height / blockPlanetWidthPx) * 0.9

  const goUp = () => sendEngine({ type: EngineAction.Up, spriteId: myId })
  const goLeft = () => sendEngine({ type: EngineAction.Left, spriteId: myId })
  const goDown = () => sendEngine({ type: EngineAction.Down, spriteId: myId })
  const goRight = () => sendEngine({ type: EngineAction.Right, spriteId: myId })

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goRight()
      else if (e.key === 'ArrowLeft') goLeft()
      else if (e.key === 'ArrowDown') goDown()
      else if (e.key === 'ArrowUp') goUp()
    }
    addEventListener('keyup', onKeyUp)
    return () => {
      removeEventListener('keyup', onKeyUp)
    }
  }, [goUp, goLeft, goDown, goRight])

  const cameraSprite = engine.sprites[myId] ?? engine.sprites[keys(engine.sprites)[0]!]
  const camera = cameraSprite?.blockFace ?? 'front'
  const cameraX = cameraSprite?.x ?? 0
  const cameraY = cameraSprite?.y ?? 0

  const bg = <div className="absolute w-full h-full bg-gradient-to-b from-blue-400 to-blue-100" />

  const cube = (
    <div
      className="transition-transform duration-1000"
      style={{
        transform: `scale(${scale})`,
      }}
    >
      <BlockPlanet mapNumber={0} camera={camera} cameraX={cameraX} cameraY={cameraY} />
    </div>
  )

  const screenDPad = <ScreenDPad onUp={goUp} onLeft={goLeft} onDown={goDown} onRight={goRight} />

  return (
    <div className="absolute flex items-center justify-center w-full h-full overflow-hidden">
      {bg}
      {cube}
      {screenDPad}
    </div>
  )
}

export default App
