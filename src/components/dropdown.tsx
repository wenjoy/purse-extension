import { useState } from 'react'
import cls from 'classnames'
import IconDown from './icons/icon-down'
import IconUp from './icons/icon-up'

interface ItemProps {
  className?: string
  selected?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

const DropdownItem: React.FC<ItemProps> = ({ className, selected, children, onClick }) => {
  return <div className={cls(
    className,
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



const data = [
  { id: 1, name: 'andrease', address: '0x1001200120012001' },
  { id: 2, name: 'bbkddkkk', address: '0x2001200120012001' },
  { id: 3, name: 'caldown', address: '0x8001200120012001' },
]
const selectedId = 1
interface Props {
  data?: []
  onAdd?: () => void
}
const Dropdown: React.FC<Props> = ({onAdd}) => {
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
      <div className='absolute top-6 left-0 px-1 py-2 space-y-1 bg-white shadow-md rounded'>
        {data.map(({ name, address, id }) =>
          <DropdownItem
            onClick={() => clickHandler(id)}
            selected={id === selectedId}>
            <span>{name} {address}</span>
          </DropdownItem>)}
          <DropdownItem className="flex justify-center hover:bg-white">
            <span onClick={onAdd} className='border rounded-lg px-1 shadow-sm text-white bg-slate-600 active:bg-slate-500 hover:bg-slate-400 select-none'>Add a new account</span>
          </DropdownItem>
      </div>
    }
  </div>
}

export default Dropdown