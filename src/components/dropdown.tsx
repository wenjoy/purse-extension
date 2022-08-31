import { useState } from 'react'
import cls from 'classnames'
import IconDown from './icons/icon-down'
import IconUp from './icons/icon-up'

interface Props {
  data?: []
}

const data = [
  { id: 1, name: 'andrease', address: '0x1001200120012001' },
  { id: 2, name: 'bbkddkkk', address: '0x2001200120012001' },
  { id: 3, name: 'caldown', address: '0x8001200120012001' },
]
const selectedId = 1

interface ItemProps {
  selected: boolean
  children: React.ReactElement
  onClick?: () => void
}

const DropdownItem: React.FC<ItemProps> = ({ selected, children, onClick }) => {
  return <div className={cls(
    'hover:bg-gray-200',
    'cursor-pointer',
    {
     'bg-gray-300': selected
  })}
  onClick={onClick}
  >
    {children}
  </div>
}

const Dropdown: React.FC<Props> = () => {
  const [expanded, setExpaned] = useState(false)
  const [selectedId, setSelectedId] = useState(1)
  const selected = data.find(({ id }) => id === selectedId)

  const clickHandler = (id: number) => {
    setExpaned(false)
    setSelectedId(id)
  }
  const toggle = () => {
    setExpaned(!expanded)
  }

  return <div className='container relative'>
    <div className='flex cursor-pointer items-center' onClick={toggle}>
      <span className='select-none space-x-1'>
        <span> {selected!.name} </span>
        <span> {selected!.address} </span>
      </span>
      {
        expanded
          ? <IconUp className='w-4 h-4 ml-1 text-gray-600' />
          : <IconDown className='w-4 h-4 ml-1 text-gray-600' />
      }
    </div>

    {expanded &&
      <div className='absolute top-6 left-0 py-1 space-y-1 bg-white shadow-md rounded'>
        {data.map(({ name, address, id }) =>
          <DropdownItem
            onClick={() => clickHandler(id)}
            selected={id === selectedId}>
            <span>{name} {address}</span>
          </DropdownItem>)}
      </div>
    }
  </div>
}

export default Dropdown