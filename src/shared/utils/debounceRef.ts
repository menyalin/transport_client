export function debounce(fn: (...args: any[]) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(fn, ms, ...args)
  }
}
