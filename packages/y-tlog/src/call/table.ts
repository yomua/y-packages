import write from '../write'

export default function <T>(data: T) {
  console.table(data)

  write(JSON.stringify(data))
}
