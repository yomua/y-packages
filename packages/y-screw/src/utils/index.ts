import fs from 'fs'

function getFileContent(path) {
  const content = fs.readFileSync(path, 'utf-8')
}
