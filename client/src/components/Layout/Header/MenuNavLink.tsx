import { FC } from 'react';

import { NavLink } from 'react-router-dom';

interface Props {
  link: string;
  title: string;
}

const MenuNavLink: FC<Props> = ({ link, title }) => {
  return (
    <NavLink className="dropdown-item" to={link}>
      <span>{title}</span>
    </NavLink>
  );
};

export default MenuNavLink;
