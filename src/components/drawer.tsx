import cls from 'classnames';
import { useEffect, useRef, useState } from 'react';

interface Props {
  visible: boolean
  children?: React.ReactNode
  onClose: () => void
}

const Drawer = ({ visible: _visible, children, onClose }: Props) => {
  const [visible, setVisible] = useState(_visible)
  const [fade, setFade] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setVisible(_visible)
  }, [_visible])

  useEffect(() => {
    setFade(visible)
  }, [visible])

  const hide = (e: React.MouseEvent<HTMLElement>) => {
    if(e.target !== containerRef.current) {
      return false
    }

    setFade(false)

    setTimeout(() => {
      setVisible(false)
      onClose()
    }, 1000)
  }

  return <div className={cls(
    { 'visible': visible },
    { 'hidden': !visible },
    'fixed left-0 bottom-0 backdrop-blur-sm w-full h-full',
  )}
    onClick={hide}
    ref={containerRef}
  >
    <div className={cls(
      'absolute bottom-0 left-0 border-solid border-t-2 border-gray-700 p-2.5 bg-white w-full h-auto space-y-2',
      { 'animate-[fade-in_1s_ease-in-out]': fade },
      { 'animate-[fade-out_1s_ease-in-out]': !fade },

    )}>
      {children}
    </div>
  </div>
}

export default Drawer