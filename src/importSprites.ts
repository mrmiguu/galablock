import { useAsync } from 'react-use'
import { fetchImport } from './utils'

const imports = import.meta.glob<{ default: string }>('./assets/sprites/**/*')

const cache: { [path: string]: HTMLImageElement } = {}

async function fetchSprite(path: string) {
  if (!(path in cache)) {
    const src = await fetchImport(imports, path)

    const image = new Image()
    await new Promise(resolve => {
      image.onload = resolve
      image.src = src
    })

    cache[path] = image
  }

  return cache[path]!
}

const useSprite = (path: string) => useAsync(() => fetchSprite(path), [path])

export { imports, fetchSprite, useSprite }
