import { Howl, HowlOptions } from 'howler'
import useAsync from 'react-use/lib/useAsync'
import { fetchImport } from './utils'

const imports = import.meta.glob<{ default: string }>('./assets/sounds/**/*')

type Sound = 'bump' | 'step'

const cache: { [sound: string]: Howl } = {}

async function fetchSound(sound: Sound, options: Partial<Omit<HowlOptions, 'src'>> = {}) {
  if (!(sound in cache)) {
    const src = await fetchImport(imports, `./assets/sounds/${sound}.wav`)

    cache[sound as string] = new Howl({ ...options, src })
  }

  return cache[sound]!
}

function useSound(sound: Sound, options: Partial<Omit<HowlOptions, 'src'>> = {}) {
  return useAsync(() => fetchSound(sound, options), [sound])
}

export { imports, fetchSound, useSound }
