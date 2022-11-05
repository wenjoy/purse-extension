interface Props {
  name: string
}

const Navbar = ({ name }: Props) => {
  return <span className='font-bold underline hover:text-gray-500'>{name}</span>;
};

export default Navbar;
