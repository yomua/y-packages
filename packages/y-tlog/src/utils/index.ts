export function getEnv() {
  try {
    if (window && document) {
      return 'browser'
    }
  } catch (error) {
    return 'node'
  }

  return 'unknown'
}
