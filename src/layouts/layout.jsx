import React from "react";
import Footer from "../components/footer";
import '../../styles/layout.css'; 

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
