import useAsync from 'react-use/lib/useAsync'

const { stringify, parse } = JSON
const { min, max, abs, random } = Math
const { keys, values, entries } = Object

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchImport<T = any>(imports: Record<string, () => Promise<{ default: T }>>, key: string) {
  if (!(key in imports)) throw new Error(`Failed to find import for "${key}"`)

  const importFn = imports[key]!
  const { default: result } = await importFn()
  return result
}

function useImport<T = any>(imports: Record<string, () => Promise<{ default: T }>>, key: string) {
  return useAsync(() => fetchImport(imports, key), [key])
}

export { stringify, parse, min, max, abs, random, keys, values, entries, sleep, fetchImport, useImport }
