import crypto from 'crypto'
import {readFile} from 'fs'

const BYTE_LEN = 16
const ENT = BYTE_LEN * 8 / 32
const entroph = crypto.randomBytes(BYTE_LEN)
const entrophBinary = []

for (const item of entroph) {
  entrophBinary.push(item.toString(2).padStart(8, '0'))
}

const entrophHash = crypto.createHash('sha256').update(entroph).digest()
const checksum = entrophHash[0].toString(2).padStart(8, '0').slice(0, ENT)
const entrophWithChecksum = entrophBinary.join('') + checksum
const mnemonicIndex = []
let mnemonic = []

let temp = entrophWithChecksum

while(temp.length > 0) {
  mnemonicIndex.push(parseInt(temp.slice(0,11), 2))
  temp = temp.slice(11)
}
console.log('entroph', mnemonicIndex);

readFile('./src/utils/wordlist', (err, data) => {
  if(err) {
    console.error(err);
    return
  }
  const wordlist = data.toString().split('\n')
  mnemonic = mnemonicIndex.map((i) => wordlist[i])

  crypto.pbkdf2(mnemonic.join(' '),'mnemonic',2048, 64, 'sha512', (err, key) => {
    if(err) {
      console.error(err);
    }
    console.log('wordlist: ', mnemonic.join(' '));
    console.log('key: ', key.toString('hex'));
    console.log('key length: ', key.byteLength);
  })
})
