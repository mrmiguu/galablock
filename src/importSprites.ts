const imports = import.meta.glob<{ default: string }>('./assets/sprites/**/*')

export { imports }
