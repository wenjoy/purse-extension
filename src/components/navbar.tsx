interface Props {
  name: string
}

const Navbar: React.FC<Props> = ({name}) => {
  return <span className='font-bold underline hover:text-gray-500'>{name}</span>
}

export default Navbar
