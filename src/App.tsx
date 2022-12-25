import { useEffect } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'

import BlockPlanet from './BlockPlanet'
import { Action, Direction } from './BlockPlanetTypes'
import { tilePx } from './consts'
import { useEngine } from './Engine'
import ScreenDPad from './ScreenDPad'
import { keys } from './utils'

function App() {
  const myId = 'abc-123'

  const [engine, sendEngine] = useEngine()

  useEffect(() => {
    sendEngine({ type: Action.SetMap, map: { size: 9 } })

    sendEngine({
      type: Action.CreateSprite,
      sprite: {
        id: myId,
        sprite: 'm1',
        blockFace: 'front',
        x: 4,
        y: 4,
      },
    })
  }, [])

  const { width, height } = useWindowSize(innerWidth, innerHeight)

  const blockPlanetWidthPx = engine.map.size * tilePx

  const isPortrait = width < height
  const scale = (isPortrait ? width / blockPlanetWidthPx : height / blockPlanetWidthPx) * 0.9

  const goUp = () => sendEngine({ type: Action.MoveSprite, dir: Direction.Up, spriteId: myId })
  const goLeft = () => sendEngine({ type: Action.MoveSprite, dir: Direction.Left, spriteId: myId })
  const goDown = () => sendEngine({ type: Action.MoveSprite, dir: Direction.Down, spriteId: myId })
  const goRight = () => sendEngine({ type: Action.MoveSprite, dir: Direction.Right, spriteId: myId })

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
