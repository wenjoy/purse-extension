import crypto from 'crypto'
import util from 'node:util'
import { readFile } from 'node:fs/promises'
import secp256k1 from 'secp256k1'

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

// function sha512(input) {
//   return crypto.createHash('sha512').update(input).digest()
// }

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

async function matchToWords(indexes) {
  try {
    let mnemonic = []
    const data = await readFile('./src/utils/wordlist')
    const wordlist = data.toString().split('\n')
    mnemonic = indexes.map((i) => wordlist[i])
    return mnemonic.join(' ')
  } catch (err) {
    console.error(err);
  }
}

async function generateSeed(words) {
  const pbkdf2 = util.promisify(crypto.pbkdf2)
  try {
    const key = await pbkdf2(words, 'mnemonic', 2048, 64, 'sha512')
    // console.log('key: ', key.toString('hex'));
    return key
  } catch (err) {
    console.error(err);
  }
}

function hmac(input, key) {
  return crypto.createHmac('sha512', key).update(input).digest('hex')
}

function buf2Hex(arrayBuffer) {
  return [...arrayBuffer].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function derivePubKeyFromPrvKey(prvKey) {
  const buf = Buffer.from(prvKey, 'hex')
  return buf2Hex(secp256k1.publicKeyCreate(buf))
}

function generateMasterkey(seed) {
  const key = 'Bitcoin seed'
  const hash = hmac(seed, key)
  // console.log('hash: ', hash);

  const masterPrivateKey = hash.slice(0, 64)
  // console.log('master prv key: ', masterPrivateKey);

  const masterChainCode = hash.slice(64)
  // console.log('mater chain code: ', masterChainCode);

  const masterPublicKey = derivePubKeyFromPrvKey(masterPrivateKey)
  return [masterPrivateKey, buf2Hex(masterPublicKey), masterChainCode]
}

function normalChildPrvKeyDerivation(parentPubKeyWithIndex, chainCode, parentPrvKey) {
  // js Number.MAX_SAFE_INTEGER is 2 ** 53 -1 = 9007199254740991 
  // console.log('normal child prv key======================');
  const ORDER_OF_CURVE = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494337')
  const hash = hmac(parentPubKeyWithIndex, chainCode)
  const childPrvKey = (BigInt(`0x${parentPrvKey}`) + BigInt(`0x${hash.slice(0, 64)}`)) % ORDER_OF_CURVE
  // console.log('normal child Prv Key: ', childPrvKey.toString(16));
  // console.log('normal child Pub Key: ', derivePubKeyFromPrvKey(childPrvKey.toString(16)));

  const childChainCode = hash.slice(64)
  // console.log('child Chain Code: ', childChainCode);
  return [childPrvKey, childChainCode]
}

function normalChildPubKeyDerivation(parentPubKeyWithIndex, chainCode, parentPubKey) {
  // js Number.MAX_SAFE_INTEGER is 2 ** 53 -1 = 9007199254740991 
  // console.log('normal child pub key======================');
  const ORDER_OF_CURVE = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494337')
  const hash = hmac(parentPubKeyWithIndex, chainCode)
  const childPubKey = (BigInt(`0x${parentPubKey}`) + BigInt(`0x${hash.slice(0, 64)}`)) % ORDER_OF_CURVE
  // console.log('normal child Pub Key: ', childPubKey.toString(16));

  const childChainCode = hash.slice(64)
  // console.log('child Chain Code: ', childChainCode);

  return [childPubKey, childChainCode]
}

function hardenedChildPrvKeyDerivation(parentPrvKeyWithIndex, chainCode) {
  // console.log('hardened child prv key======================');
  const ORDER_OF_CURVE = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494337')
  const hash = hmac(parentPrvKeyWithIndex, chainCode)
  const childPrvKey = (BigInt(`0x${parentPrvKeyWithIndex}`) + BigInt(`0x${hash.slice(0, 64)}`)) % ORDER_OF_CURVE
  // console.log('hardened child Prv Key: ', childPrvKey.toString(16));

  const childChainCode = hash.slice(64)
  // console.log('child Chain Code: ', childChainCode);

  return [childPrvKey, childChainCode]
}

function childKeyGenerator() {
  const NORMAL_CHILD_BOUNDARY = 2 ** 16
  let index = 0

  return (prvKey, pubKey, chainCode) => {
    let prvKey_
    let pubKey_
    let chainCode_
    const pubKeyWithIndex = pubKey + String(index)
    const prvKeyWithIndex = prvKey + String(index)

    if (index < NORMAL_CHILD_BOUNDARY) {
      [prvKey_, chainCode_] = normalChildPrvKeyDerivation(pubKeyWithIndex, chainCode, prvKey)
      [pubKey_] = normalChildPubKeyDerivation(pubKeyWithIndex, chainCode, pubKey)
    } else {
      [prvKey_, chainCode_] = hardenedChildPrvKeyDerivation(prvKeyWithIndex, chainCode)
    }
    index++

    return [prvKey_, pubKey_, chainCode_]
  }
}

// rome-ignore lint: temp
async function generateWords() {
  const entroph = generateEntroph()
  const entrophBinary = converToBinary(entroph)
  const entrophHash = sha256(entroph)
  const ENT = getENT(entroph)
  const checksum = getChecksum(entrophHash, ENT)
  const entrophWithChecksum = entrophBinary.join('') + checksum
  const wordsIndexes = groupForIndex(entrophWithChecksum)
  const words = await matchToWords(wordsIndexes)
  return words
}

function base58Encode(str) {
  const code = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let buf = Buffer.from(str)
  let result = buf.reduce((x,y) => BigInt(x) * 256n + BigInt(y))

  let encoded = []

  while (result > 0) {
    let remainder = result % 58n
    encoded.unshift(code[remainder])
    result = result / 58n
  }

  return encoded.join('')
}

function serializeKey(version, depth, parentFingerprint, childNumber, chainCode, key) {
  const versionMap = {
    xprev: '0488ade4',
    xpub: '0488b21e',
  }
  // rome-ignore lint: no
  const aggregasion = versionMap[version] + depth + parentFingerprint + childNumber + chainCode + '00' + key
  const checksum = sha256(aggregasion).slice(0, 4)
  const result = aggregasion + checksum
  return result
}

async function main() {
  // const words = await generateWords()
  const words = 'envelope mango blouse teach lake exclude approve ankle tragic novel milk ribbon'
  const seed = await generateSeed(words)
  console.log('seed', seed.toString('hex'))

  const masterPrvKey = seed.slice(0, 64)
  const masterChainCode = seed.slice(64)

  // console.log('debug: ', base58Encode('hi'));

  const rootKey = serializeKey('xprev', '00', '00000000', '00000000', masterChainCode, masterPrvKey)
  console.log('rootKey: ', rootKey);
  console.log('rootKey 58: ', base58Encode(rootKey));

  let [prvKey, pubKey, chainCode] = generateMasterkey(seed)
  console.log('root prv key: ', prvKey);

  let generateChildKey = childKeyGenerator();

  [prvKey, pubKey, chainCode] = generateChildKey(prvKey, pubKey, chainCode)
}

main()