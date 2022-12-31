import { Howl, HowlOptions } from 'howler'
import useAsync from 'react-use/lib/useAsync'
import { fetchImport } from './utils'

const imports = import.meta.glob<{ default: string }>('./assets/music/**/*')

type Music = "This Is My Father's World"

const cache: { [music: string]: Howl } = {}

async function fetchMusic(music: Music, options: Partial<Omit<HowlOptions, 'src'>> = {}) {
  if (!(music in cache)) {
    const src = await fetchImport(imports, `./assets/music/${music}.mp3`)

    cache[music as string] = new Howl({ ...options, src })
  }

  return cache[music]!
}

function useMusic(music: Music, options: Partial<Omit<HowlOptions, 'src'>> = {}) {
  return useAsync(() => fetchMusic(music, options), [music])
}

export { imports, fetchMusic, useMusic }
