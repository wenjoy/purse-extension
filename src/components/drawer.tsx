import cls from 'classnames';

interface Props {
  visible: boolean
  children?: React.ReactNode
  onClick?: () => void
}

const Drawer = ({ visible, children, onClick }: Props) => {
  return <div className={cls(
    { 'visible': visible },
    { 'hidden': !visible },
    'fixed left-0 bottom-0 backdrop-blur-sm w-full h-full',
  )}
  onClick={onClick}
  >
    <div className={cls(
'absolute bottom-0 left-0 border-solid border-t-2 border-gray-700 p-2.5 bg-white w-full h-auto space-y-2',
'animate-[showup_1s_ease-in-out]'
    )}>
      {children}
    </div>
    </div>
}

export default Drawer