import { useEffect } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'

import BlockPlanet from './BlockPlanet'
import { Action, Direction, Planet, SpriteKind } from './BlockPlanetTypes'
import { tilePx } from './consts'
import { useEngine } from './Engine'
import ScreenDPad from './ScreenDPad'
import { keys, pickRandom, shuffle, uuid } from './utils'

function App() {
  const myId = 'abc-123'

  const [engine, sendEngine] = useEngine()
  const myPlayer = engine.sprites[myId]

  useEffect(() => {
    const planet = Planet.Tutorial
    const size = 9

    const shuffledTiles = [
      ...[...Array(size ** 2)].map((_, i) => ['top', i % size, ~~(i / size)] as const),
      ...[...Array(size ** 2)].map((_, i) => ['left', i % size, ~~(i / size)] as const),
      ...[...Array(size ** 2)].map((_, i) => ['front', i % size, ~~(i / size)] as const),
      ...[...Array(size ** 2)].map((_, i) => ['right', i % size, ~~(i / size)] as const),
      ...[...Array(size ** 2)].map((_, i) => ['bottom', i % size, ~~(i / size)] as const),
      ...[...Array(size ** 2)].map((_, i) => ['back', i % size, ~~(i / size)] as const),
    ]
    shuffle(shuffledTiles, { seed: `${planet}_objects` })

    sendEngine({ action: Action.SetPlanet, planet })

    for (const _ of Array(6)) {
      const seed = `${planet}_npcs`
      const sprites = ['fi', 'he', 'hr', 'kg', 'kn', 'mn', 'om', 'ow', 'po', 'wm'] as const

      const [blockFace, x, y] = shuffledTiles.pop()!

      sendEngine({
        action: Action.CreateSprite,
        sprite: {
          id: uuid({ seed }),
          sprite: pickRandom(sprites, { seed }),
          blockFace,
          x,
          y,
          dir: Direction.Down,
          hp: -1,
          kind: SpriteKind.NPC,
        },
      })
    }

    for (const _ of Array(6)) {
      const seed = `${planet}_beasts`
      const sprites = ['sl'] as const
      const directions = [Direction.Up, Direction.Left, Direction.Down, Direction.Right] as const

      const [blockFace, x, y] = shuffledTiles.pop()!

      sendEngine({
        action: Action.CreateSprite,
        sprite: {
          id: uuid({ seed }),
          sprite: pickRandom(sprites, { seed }),
          blockFace,
          x,
          y,
          dir: pickRandom(directions, { seed }),
          hp: 1,
          kind: SpriteKind.Aggressive,
        },
      })
    }

    const [blockFace, x, y] = shuffledTiles.pop()!

    sendEngine({
      action: Action.CreateSprite,
      sprite: {
        id: myId,
        sprite: 'mn',
        blockFace,
        x,
        y,
        dir: Direction.Down,
        hp: 5,
        kind: SpriteKind.Player,
      },
    })
  }, [])

  const { width, height } = useWindowSize(innerWidth, innerHeight)

  const blockPlanetWidthPx = engine.planet.size * tilePx

  const isPortrait = width < height
  const scale = (isPortrait ? width / blockPlanetWidthPx : height / blockPlanetWidthPx) * 0.9

  const goUp = () => sendEngine({ action: Action.MoveSprite, dir: Direction.Up, spriteId: myId })
  const goLeft = () => sendEngine({ action: Action.MoveSprite, dir: Direction.Left, spriteId: myId })
  const goDown = () => sendEngine({ action: Action.MoveSprite, dir: Direction.Down, spriteId: myId })
  const goRight = () => sendEngine({ action: Action.MoveSprite, dir: Direction.Right, spriteId: myId })

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
      <BlockPlanet mapNumber={engine.planet.number} camera={camera} cameraX={cameraX} cameraY={cameraY} />
    </div>
  )

  const screenDPad = <ScreenDPad onUp={goUp} onLeft={goLeft} onDown={goDown} onRight={goRight} />

  return (
    <div
      className={`absolute flex items-center justify-center w-full h-full overflow-hidden ${
        myPlayer?.hp === 0 && 'grayscale'
      }`}
    >
      {bg}
      {cube}
      {screenDPad}
    </div>
  )
}

export default App
