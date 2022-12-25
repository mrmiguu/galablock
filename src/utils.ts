import useAsync from 'react-use/lib/useAsync'
import seedrandom from 'seedrandom'
import { v5 as uuidv5 } from 'uuid'

const { log, warn, error } = console
const { stringify, parse } = JSON
const { min, max, ceil, abs, pow, sqrt, sin, cos, tan, atan, atan2, PI } = Math
const { keys, values, entries } = Object

type RandomOptions = {
  seed: string
}

const _random: { [seed: string]: seedrandom.PRNG } = {}
const random = ({ seed }: Partial<RandomOptions> = {}) => {
  const key = seed ?? '*'
  _random[key] = _random[key] ?? seedrandom(seed)
  return _random[key]!()
}

const UUID_NAMESPACE = '3bb2e24a-6489-41c7-8096-7cba0e043855'

const uuid = ({ seed }: Partial<RandomOptions> = {}) => uuidv5(`${random({ seed })}`, UUID_NAMESPACE)

// https://stackoverflow.com/a/12646864/4656851
const shuffle = <T>(list: T[], { seed }: Partial<RandomOptions> = {}): T[] => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = ~~(random({ seed }) * (i + 1))
    ;[list[i], list[j]] = [list[j]!, list[i]!]
  }
  return list
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const pickRandom = <T>(list: readonly T[], { seed }: Partial<RandomOptions> = {}): T =>
  list[~~(list.length * random({ seed }))]!

async function fetchImport<T = any>(imports: Record<string, () => Promise<{ default: T }>>, key: string) {
  if (!(key in imports)) throw new Error(`Failed to find import for "${key}"`)

  const importFn = imports[key]!
  const { default: result } = await importFn()
  return result
}

function useImport<T = any>(imports: Record<string, () => Promise<{ default: T }>>, key: string) {
  return useAsync(() => fetchImport(imports, key), [key])
}

export {
  log,
  warn,
  error,
  stringify,
  parse,
  min,
  max,
  ceil,
  abs,
  pow,
  sqrt,
  sin,
  cos,
  tan,
  atan,
  atan2,
  PI,
  keys,
  values,
  entries,
  uuid,
  random,
  shuffle,
  sleep,
  pickRandom,
  fetchImport,
  useImport,
}
