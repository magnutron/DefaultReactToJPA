import { NavLink } from "react-router-dom";

interface NavItemProps {
  pathLink: string;
  itemName: string;
}

export default function NavItem({ pathLink, itemName }: NavItemProps) {
  return (
    <li>
      <NavLink to={pathLink} className="block py-2 px-3 md:p-0 text-white hover:text-outer-space-200 transition rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">
        {itemName}
      </NavLink>
    </li>
  );
}
