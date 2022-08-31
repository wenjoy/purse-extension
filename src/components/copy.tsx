import IconCopy from './icons/icon-copy'

interface Props {
  onClick?: (e?: React.MouseEvent<SVGElement>) => void
}

const Copy: React.FC<Props> = ({onClick}) => {
  return <IconCopy onClick={onClick} className="h-[1em] ml-1 cursor-copy text-blue-400 hover:text-blue-200 inline" />
}

export default Copy