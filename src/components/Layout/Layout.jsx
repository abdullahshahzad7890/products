import React from "react";

import Sidebar from "../Sidebar/Sidebar";

import styles from "./Layout.module.scss";

const Layout = (props) => {
  const { children } = props;

  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.pageContentContainer}>{children}</div>
    </div>
  );
};

export default Layout;
