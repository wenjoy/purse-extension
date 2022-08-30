import { useState } from 'react'
import Navbar from '../../components/navbar'

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

  return (
    <div className="container h-full py-2.5 flex flex-col">
      <section className="w-full shadow-md py-2.5 flex justify-around items-center">
        <span>{name} {address}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[1em] text-blue-400 inline">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
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
