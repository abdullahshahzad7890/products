import clsx from "clsx";
import { NavLink } from "react-router-dom";

import styles from "./SidebarItem.module.scss";

const SidebarItem = (props) => {
  const { label, to } = props;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(styles.navItem, styles.open, {
          [styles.selected]: isActive,
        })
      }
    >
      <div>{<span className={styles.label}>{label}</span>}</div>
    </NavLink>
  );
};

export default SidebarItem;
