const isTesting = process.env.NODE_ENV === 'test'

let id = 0
export function timer(type, data) {
  if (isTesting) return {end: () => {}}

  const tag = `${type}-${id++}`
  console.time(tag)
  return {
    end: () => {
      console.timeEnd(tag)
      if (data) console.dir(data)
    }
  }
}
