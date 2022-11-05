import { useState } from 'react';
import IconDown from './icons/icon-down';
import IconUp from './icons/icon-up';
import cls from 'classnames';

interface ItemProps {
  className?: string
  selected?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

const DropdownItem= ({ className, selected, children, onClick }: ItemProps) => {
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
  </div>;
};

interface Option {
  label: string,
  value: string
}

interface Props {
  data?: Option[]
  selected?: string
  onSelect: (id: string) => void
  onAdd?: () => void
}
const Dropdown = ({ onAdd, onSelect, data = [], selected: selected_ }: Props) => {
  const [expanded, setExpaned] = useState(false);
  const selected = data.find(({ value }) => value === selected_) || data[0];

  const clickHandler = (id: string) => {
    setExpaned(false);
    onSelect(id);
  };

  const toggle = () => {
    setExpaned(!expanded);
  };

  return <div className='container relative'>
    <div className='flex cursor-pointer items-center' onClick={toggle}>
      <span className='select-none space-x-1'>
        <span> {selected!.label} </span>
        <span> {selected!.value} </span>
      </span>
      {
        expanded
          ? <IconUp className='w-4 h-4 ml-1 text-gray-600' />
          : <IconDown className='w-4 h-4 ml-1 text-gray-600' />
      }
    </div>

    {expanded &&
      <div className='absolute top-6 left-0 px-1 py-2 space-y-1 bg-white shadow-md rounded'>
        {data.map(({ label, value }) =>
          <DropdownItem
            key={value}
            onClick={() => clickHandler(value)}
            selected={value === selected_}>
            <span>{label} {value}</span>
          </DropdownItem>)}
        <DropdownItem className="flex justify-center hover:bg-white">
          <span onClick={onAdd} className='border rounded-lg px-1 shadow-sm text-white bg-slate-600 active:bg-slate-500 hover:bg-slate-400 select-none'>Add a new account</span>
        </DropdownItem>
      </div>
    }
  </div>;
};

export default Dropdown;