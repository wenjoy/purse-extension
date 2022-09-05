import { useState } from 'react'
import Dropdown from '../../components/dropdown'
import Navbar from '../../components/navbar'
import Copy from '../../components/copy'
import Drawer from '../../components/drawer'
import useWeb3 from '../../hooks/useWeb3'
import truncate from '../../utils/truncate'

interface Account {
  name: string,
  address: string
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
  const web3 = useWeb3()

  // TODO: jump to create wallet
  accounts.push({
    name: 'Account1',
    address: '0x100000101'
  })
  const wallet = web3.eth.accounts.wallet
  
  for (let i = 0; i < wallet.length; i++) {
    const element = wallet[i];
    accounts.push({
      name: `Wallet ${i+1}`,
      address: truncate(element.address)
    })
  }

  const [selected, setSelected] = useState(accounts[0].address)

  const balance = 100

  networks.push({
    name: 'ethereum',
    rpcUrl: 'http://abc',
    chainId: 1,
    symbol: 'ETH',
    icon: 'E'
  })

  const { name: netwokName, icon, symbol } = networks[0]
  const navbar = [
    { name: 'Token' },
    { name: 'Assets' },
    { name: 'Transaction' },
    { name: 'Setting' },
  ]
  const currentAccount = accounts.find(({address}) => address === selected)
  const [visible, setVisible ]= useState(false)

  const copyHandler = () => {
    navigator.clipboard.writeText(String(currentAccount!.address)).then(() => {alert('Copied')}).catch(() => {
      alert('Copy failed')
    })
  }
  const showDrawer = () => {
    setVisible(true)
  }

  const hideDrawer = () => {
    setVisible(false)
  }

  const creatAccont = () => {
    web3.eth.accounts.wallet.create(1)
    hideDrawer()
  }

  const selectHandler = (id: string) => {
    setSelected(id)
  }

  const options = accounts.map(({name, address})=>({label: name, value: address}))

  return (
    <div className="container h-full py-2.5 flex flex-col">
      <section className="w-full shadow-md py-2.5 flex justify-around items-center">
        <span className='flex items-center justify-between'>
          <Dropdown selected={selected} data={options} onAdd={showDrawer} onSelect={selectHandler} />
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
      <Drawer visible={visible} onClose={hideDrawer}>
        <button className='btn' onClick={creatAccont}>Create a new account</button>
        <button className='btn'>Import from private key</button>
      </Drawer>
    </div>
  )
}

export default App
