import { useState } from 'react'

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

  const {name, address} = accounts[0]
  const {name:netwokName, icon, symbol} = networks[0]

  return (
    <div className="app">
      <section className="header">
        <span>{name} {address} <i>Copy</i></span>
        <span>{icon} {netwokName}</span>
      </section>
      <section className="content">
        {balance} {symbol}
      </section>
      <section className="nav-bar">
        <span>Token</span>
        <span>Assets</span>
        <span>Transaction</span>
        <span>Setting</span>
      </section>
    </div>
  )
}

export default App
