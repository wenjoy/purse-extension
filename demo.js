import crypto from 'crypto';
import util from 'node:util';
import { readFile } from 'node:fs/promises';
import secp256k1 from 'secp256k1';
import elliptic from 'elliptic';

function generateEntroph(byteLength = 16) {
  return crypto.randomBytes(byteLength);
}

function converToBinary(buffer) {
  const binaries = [];

  for (const item of buffer) {
    binaries.push(item.toString(2).padStart(8, '0'));
  }
  return binaries;
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest();
}

function rmd160(input) {
  return crypto.createHash('rmd160').update(input).digest();
}

function createFigerprint(input) {
  const hash160 = rmd160(sha256(input));
  return hash160.slice(0, 4);
}

// function sha512(input) {
//   return crypto.createHash('sha512').update(input).digest()
// }

function getChecksum2(input) {
  //checksum in bitcoin is sha256 twice
  const temp = sha256(input);
  const result = sha256(temp);
  return result.slice(0, 4);
}

function getENT(entroph) {
  return entroph.byteLength * 8 / 32;
}

function getChecksum(hash, ENT) {
  // only for entroph
  hash[0].toString(2).padStart(8, '0').slice(0, ENT);
}

function groupForIndex(bits) {
  let temp = bits;
  const indexes = [];

  while (temp.length > 0) {
    indexes.push(parseInt(temp.slice(0, 11), 2));
    temp = temp.slice(11);
  }
  return indexes;
}

async function matchToWords(indexes) {
  try {
    let mnemonic = [];
    const data = await readFile('./src/utils/wordlist');
    const wordlist = data.toString().split('\n');
    mnemonic = indexes.map((i) => wordlist[i]);
    return mnemonic.join(' ');
  } catch (err) {
    console.error(err);
  }
}

async function generateSeed(words) {
  const pbkdf2 = util.promisify(crypto.pbkdf2);
  try {
    const key = await pbkdf2(words, 'mnemonic', 2048, 64, 'sha512');
    // console.log('key: ', key.toString('hex'));
    return key;
  } catch (err) {
    console.error(err);
  }
}

function hmac(input, key) {
  return crypto.createHmac('sha512', key).update(input).digest('hex');
}

function derivePubKeyFromPrvKey(prvKey) {
  const buf = Buffer.from(prvKey, 'hex');
  return Buffer.from(secp256k1.publicKeyCreate(buf)).toString('hex');
}

function generateMasterkey(seed) {
  const key = 'Bitcoin seed';
  const hash = hmac(seed, key);
  // console.log('hash: ', hash);

  const masterPrivateKey = hash.slice(0, 64);
  // console.log('master prv key: ', masterPrivateKey);

  const masterChainCode = hash.slice(64);
  // console.log('mater chain code: ', masterChainCode);

  const masterPublicKey = derivePubKeyFromPrvKey(masterPrivateKey);
  return [masterPrivateKey, masterPublicKey, masterChainCode];
}

function normalChildPrvKeyDerivation(parentPubKeyWithIndex, chainCode, parentPrvKey) {
  // js Number.MAX_SAFE_INTEGER is 2 ** 53 -1 = 9007199254740991 
  // console.log('normal child prv key======================');
  const ORDER_OF_CURVE = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494337');
  const hash = hmac(Buffer.from(parentPubKeyWithIndex, 'hex'), Buffer.from(chainCode, 'hex'));
  const childPrvKey = (BigInt(`0x${parentPrvKey}`) + BigInt(`0x${hash.slice(0, 64)}`)) % ORDER_OF_CURVE;
  // console.log('normal child Pub Key: ', derivePubKeyFromPrvKey(childPrvKey.toString(16)));

  const childChainCode = hash.slice(64);
  return [childPrvKey.toString(16), childChainCode];
}


function normalChildPubKeyDerivation(parentPubKeyWithIndex, chainCode, parentPubKey) {
  // js Number.MAX_SAFE_INTEGER is 2 ** 53 -1 = 9007199254740991 
  // console.log('normal child pub key======================');
  const EC = elliptic.ec;
  const ec = new EC('secp256k1');
  const hash = hmac(Buffer.from(parentPubKeyWithIndex, 'hex'), Buffer.from(chainCode, 'hex'));
  const Il = hash.slice(0, 64);
  const prvKey = ec.keyFromPrivate(Il);
  const prvPoint = prvKey.getPublic();
  const pubKey = ec.keyFromPublic(parentPubKey, 'hex');
  const pubPoint = pubKey.getPublic();
  const childPubKey = prvPoint.add(pubPoint);

  const childChainCode = hash.slice(64);

  return [childPubKey.encode('hex', true), childChainCode];
}

function hardenedChildPrvKeyDerivation(parentPrvKeyWithIndex, chainCode) {
  // console.log('hardened child prv key======================');
  const ORDER_OF_CURVE = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494337');
  const hash = hmac(Buffer.from(parentPrvKeyWithIndex, 'hex'), Buffer.from(chainCode, 'hex'));
  const childPrvKey = (BigInt(`0x${parentPrvKeyWithIndex}`) + BigInt(`0x${hash.slice(0, 64)}`)) % ORDER_OF_CURVE;

  const childChainCode = hash.slice(64);

  return [childPrvKey.toString(16), childChainCode];
}

function generateChildKey(prvKey, pubKey, chainCode, index) {
  const NORMAL_CHILD_BOUNDARY = (2 ** 32) / 2;
  let prvKey_;
  let pubKey_;
  let chainCode_;
  const pubKeyWithIndex = pubKey + String(index).padStart(8, '0');
  const prvKeyWithIndex = prvKey + String(index).padStart(8, '0');

  if (index < NORMAL_CHILD_BOUNDARY) {
    [prvKey_, chainCode_] = normalChildPrvKeyDerivation(pubKeyWithIndex, chainCode, prvKey);
    [pubKey_] = normalChildPubKeyDerivation(pubKeyWithIndex, chainCode, pubKey);
  } else {
    [prvKey_, chainCode_] = hardenedChildPrvKeyDerivation(prvKeyWithIndex, chainCode);
    pubKey_ = Buffer.from(secp256k1.publicKeyCreate(Buffer.from(prvKey_, 'hex'))).toString('hex');
    console.log('pubKey_: ', pubKey_);
  }

  return [prvKey_, pubKey_, chainCode_];
}

async function generateWords() {
  const entroph = generateEntroph();
  const entrophBinary = converToBinary(entroph);
  const entrophHash = sha256(entroph);
  const ENT = getENT(entroph);
  const checksum = getChecksum(entrophHash, ENT);
  const entrophWithChecksum = entrophBinary.join('') + checksum;
  const wordsIndexes = groupForIndex(entrophWithChecksum);
  const words = await matchToWords(wordsIndexes);
  return words;
}

function base58Encode(input) {
  // TODO: handle leading 00
  const code = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result;

  if (typeof input === 'string') {
    let buf = Buffer.from(input);
    result = buf.reduce((x, y) => BigInt(x) * 256n + BigInt(y));
  } else {
    result = input;
  }

  let encoded = [];

  while (result > 0) {
    let remainder = result % 58n;
    encoded.unshift(code[remainder]);
    result = result / 58n;
  }

  return encoded.join('');
}

function serializeKey(version, depth, parentFingerprint, childNumber, chainCode, key) {
  const versionMap = {
    xprv: '0488ade4',
    xpub: '0488b21e',
  };
  const padding = version === 'xprv' ? '00' : '';
  const aggregasion = versionMap[version] + depth + parentFingerprint + childNumber + chainCode + padding + key;
  // console.log('aggregasion: ', aggregasion);
  const checksum = getChecksum2(Buffer.from(aggregasion, 'hex'));
  const result = aggregasion + checksum.toString('hex');
  return base58Encode(BigInt(`0x${result}`));
}

function deriveExtendedKeyFromPath(parentPrvKey, parentPubKey, parentChainCode, path) {
  const pathes = path.split('/');
  const NORMAL_CHILD_BOUNDARY = (2 ** 32) / 2;
  let prvKey = parentPrvKey;
  let pubKey = parentPubKey;
  let chainCode = parentChainCode;
  let currentPath = 'm';

  pathes.forEach((i) => {
    if(i === 'm') {
      return;
    }

    currentPath += `/${i}`;

    console.log(`********** derivation path: ${currentPath} **********`, );
    let index = i.includes('`') ? parseInt(i)+ NORMAL_CHILD_BOUNDARY : parseInt(i);
    [prvKey, pubKey, chainCode] = deriveNthChildKey(prvKey, pubKey, chainCode, index);
  });
}

function deriveNthChildKey(parentPrvKey, parentPubKey, parentChainCode,index) {
  console.log('index: ', index);
  const figerprint = createFigerprint(Buffer.from(parentPubKey, 'hex'));
  let [prvKey, pubKey, chainCode] = generateChildKey(parentPrvKey, parentPubKey, parentChainCode, index);
  console.log(`==========original key of ${index} ==========`);
  console.log('pubKey: ', pubKey);
  console.log('prvKey: ', prvKey);
  // [prvKey, pubKey, chainCode] = generateChildKey(
  //   "f79bb0d317b310b261a55a8ab393b4c8a1aba6fa4d08aef379caba502d5d67f9",
  //   "0252c616d91a2488c1fd1f0f172e98f7d1f6e51f8f389b2f8d632a8b490d5f6da9",
  //   "463223aac10fb13f291a1bc76bc26003d98da661cb76df61e750c139826dea8b",
  //   index
  //   );

  const serializedPrvKey = serializeKey('xprv', '01', figerprint.toString('hex'), '00000000', chainCode, prvKey);
  const serializedPubKey = serializeKey('xpub', '01', figerprint.toString('hex'), '00000000', chainCode, pubKey);
  console.log('==========original key==========');
  console.log('serializedPrvKey: ', serializedPrvKey);
  console.log('serializedPubKey: ', serializedPubKey);
  return [prvKey, pubKey, chainCode];
}

async function main() {
  // const words = await generateWords()
  const words = 'envelope mango blouse teach lake exclude approve ankle tragic novel milk ribbon';
  const seed = await generateSeed(words);

  let [prvKey, pubKey, chainCode] = generateMasterkey(seed);
  const rootKey = serializeKey('xprv', '00', '00000000', '00000000', chainCode, prvKey);
  console.log('rootKey: ', rootKey);
  deriveExtendedKeyFromPath(prvKey, pubKey, chainCode, 'm/44`/60`/0`/0');
}

main();