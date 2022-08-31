import { useState } from 'react'
import Dropdown from '../../components/dropdown'
import Navbar from '../../components/navbar'
import Copy from '../../components/copy'

interface Account {
  name: string,
  address: number
}

interface Network {
  name: string,
  rpcUrl: string,
  chainId: number,
  symbol: string,
  explorer?: string,
  icon: string
}

function App() {
  const accounts: Account[] = []
  const networks: Network[] = []
  const balance = 100
  accounts.push({
    name: 'Account1',
    address: 0x100000101
  })

  networks.push({
    name: 'ethereum',
    rpcUrl: 'http://abc',
    chainId: 1,
    symbol: 'ETH',
    icon: 'E'
  })

  const { name, address } = accounts[0]
  const { name: netwokName, icon, symbol } = networks[0]
  const navbar = [
    { name: 'Token' },
    { name: 'Assets' },
    { name: 'Transaction' },
    { name: 'Setting' },
  ]
  const currentAccount = accounts[0]
  const copyHandler = () => {
    navigator.clipboard.writeText(String(currentAccount.address)).then(() => {alert('Copied')}).catch(() => {
      alert('Copy failed')
    })
  }

  return (
    <div className="container h-full py-2.5 flex flex-col">
      <section className="w-full shadow-md py-2.5 flex justify-around items-center">
        <span className='flex items-center justify-between'>
          {/* {name} {address} */}
          <Dropdown />
          <Copy onClick={copyHandler} />
        </span>
        <span>{icon} {netwokName}</span>
      </section>
      <section className="container flex-1 flex items-center justify-center">
        <span>
          {balance} {symbol}
        </span>
      </section>
      <section className="w-full flex justify-around">
        {navbar.map(({ name }) => <Navbar name={name} />)}
      </section>
    </div>
  )
}

export default App
