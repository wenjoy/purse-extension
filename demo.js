import crypto from 'crypto'
import util from 'node:util'
import { readFile } from 'node:fs/promises'

function generateEntroph(byteLength = 16) {
  return crypto.randomBytes(byteLength)
}

function converToBinary(buffer) {
  const binaries = []

  for (const item of buffer) {
    binaries.push(item.toString(2).padStart(8, '0'))
  }
  return binaries
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest()
}

function getENT(entroph) {
  return entroph.byteLength * 8 / 32
}

function getChecksum(hash, ENT) {
  hash[0].toString(2).padStart(8, '0').slice(0, ENT)
}

function groupForIndex(bits) {
  let temp = bits
  const indexes = []

  while (temp.length > 0) {
    indexes.push(parseInt(temp.slice(0, 11), 2))
    temp = temp.slice(11)
  }
  return indexes
}

async function generateWords(indexes) {
  try {
    let mnemonic = []
    const data = await readFile('./src/utils/wordlist')
    const wordlist = data.toString().split('\n')
    mnemonic = indexes.map((i) => wordlist[i])
    return mnemonic
  } catch (err) {
    console.error(err);
  }
}

async function generateSeed(words) {
  const pbkdf2 = util.promisify(crypto.pbkdf2)
  try {
    const key = await pbkdf2(words.join(' '), 'mnemonic', 2048, 64, 'sha512')
    console.log('key: ', key.toString('hex'));
    return key
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  const entroph = generateEntroph()
  const entrophBinary = converToBinary(entroph)
  const entrophHash = sha256(entroph)
  const ENT = getENT(entroph)
  const checksum = getChecksum(entrophHash, ENT)
  const entrophWithChecksum = entrophBinary.join('') + checksum
  const wordsIndexes = groupForIndex(entrophWithChecksum)
  const words = await generateWords(wordsIndexes)
  const seed = await generateSeed(words)
  console.log('seed', seed);
}

main()