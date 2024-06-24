import { ReactElement, useState } from "react";
import classNames from "classnames";

export type Navbar = {
  name: string;
  page: ReactElement;
};

type NavbarProps = {
  name: string;
  active?: boolean;
  onActive: () => void;
};
const NavbarItem = ({ name, active = false, onActive }: NavbarProps) => {
  return (
    <li className="p-2">
      <a
        className={classNames("text-white", {
          "opacity-60 hover:opacity-80 focus:opacity-80": !active,
        })}
        href="#"
        onClick={onActive}
      >
        {name}
      </a>
    </li>
  );
};

type NavbarPanelProps = {
  navbar: Navbar[];
};
const NavbarPanel = ({ navbar }: NavbarPanelProps) => {
  const [activated, setActivated] = useState(0);
  const page = navbar[activated].page;
  const activeHandler = (index: number) => {
    setActivated(index);
  };
  return (
    <div className="w-full flex flex-col flex-1">
      <section className="flex-1">{page}</section>

      <nav className="relative w-full flex py-3 bg-gray-900 text-gray-200 shadow-lg">
        <ul className="flex flex-wrap items-center justify-around w-full pl-0 list-style-none mr-auto">
          {navbar.map(({ name }, index) => (
            <NavbarItem
              key={name}
              name={name}
              active={index === activated}
              onActive={() => activeHandler(index)}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavbarPanel;
