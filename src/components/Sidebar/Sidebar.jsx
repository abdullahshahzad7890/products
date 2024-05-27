import clsx from "clsx";

import styles from "./Sidebar.module.scss";
import SidebarItem from "./SidebarItem/SidebarItem";

const Sidebar = () => {
  const sidebarNavigationItems = [{ label: "Products", href: "/Products" }];

  return (
    <div className={clsx(styles.sidebar, styles.open)}>
      {sidebarNavigationItems.map((item) => (
        <SidebarItem key={item.label} label={item.label} to={item.href} />
      ))}
    </div>
  );
};

export default Sidebar;
